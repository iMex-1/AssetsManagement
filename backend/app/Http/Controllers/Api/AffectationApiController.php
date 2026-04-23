<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\Article;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AffectationApiController extends Controller
{
    public function __construct(private readonly FileUploadService $uploads) {}

    public function index(Request $request): JsonResponse
    {
        $query = Affectation::with(['article', 'service']);

        // voir_son_service : filtrer par service de l'utilisateur
        if (
            ! $request->user()->hasRole('Admin') &&
            $request->user()->can('voir_son_service') &&
            $request->user()->service_id
        ) {
            $query->where('service_id', $request->user()->service_id);
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('etat')) {
            $query->where('etat', $request->etat);
        }

        // historique=1 inclut les soft-deleted
        if ($request->boolean('historique')) {
            $query->withTrashed();
        }

        $affectations = $query->latest()->paginate($request->integer('per_page', 25));

        return response()->json($affectations);
    }

    public function updateEtat(Request $request, Affectation $affectation): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'etat' => 'required|in:en_service,en_panne,en_reparation,hors_service',
        ]);

        $newEtat = $validated['etat'];

        // Chef_Service peut uniquement signaler en_panne
        if ($user->can('signaler_panne') && ! $user->hasRole('Admin')) {
            if ($newEtat !== 'en_panne') {
                return response()->json(['message' => 'Vous pouvez uniquement signaler une panne.'], 403);
            }
            // Restrict to their own service
            if ($affectation->service_id !== $user->service_id) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        } elseif (! $user->can('gerer_affectations')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        DB::transaction(function () use ($affectation, $newEtat) {
            $previousEtat = $affectation->etat;

            // hors_service : décrémenter le stock (article mis au rebut)
            if ($newEtat === 'hors_service' && $previousEtat !== 'hors_service') {
                $affectation->article->decrement('stock_actuel', $affectation->quantite_affectee);
                $affectation->date_fin = now()->toDateString();
            }

            // Si on revient de hors_service (réparation réussie), on restitue le stock
            if ($previousEtat === 'hors_service' && $newEtat !== 'hors_service') {
                $affectation->article->increment('stock_actuel', $affectation->quantite_affectee);
                $affectation->date_fin = null;
            }

            $affectation->etat = $newEtat;
            $affectation->save();
        });

        return response()->json($affectation->load(['article', 'service']));
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->can('gerer_affectations')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'article_id'        => 'required|exists:articles,id',
            'service_id'        => 'required|exists:services,id',
            'quantite_affectee' => 'required|integer|min:1',
            'cible'             => 'nullable|string|max:255',
            'coordonnees_gps'   => 'nullable|string|max:100',
            'date_action'       => 'required|date',
            'photo_jointe'      => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Check sufficient stock
        $article = Article::findOrFail($validated['article_id']);
        if ($article->stock_actuel < $validated['quantite_affectee']) {
            return response()->json([
                'message' => "Stock insuffisant. Disponible: {$article->stock_actuel}",
                'errors'  => ['quantite_affectee' => ["Stock insuffisant. Disponible: {$article->stock_actuel}"]],
            ], 422);
        }

        $photoPath = null;
        if ($request->hasFile('photo_jointe')) {
            $photoPath = $this->uploads->storePhotoJointe($request->file('photo_jointe'));
        }

        DB::transaction(function () use ($validated, $photoPath, $article, &$affectation) {
            $affectation = Affectation::create([
                'article_id'        => $validated['article_id'],
                'service_id'        => $validated['service_id'],
                'quantite_affectee' => $validated['quantite_affectee'],
                'cible'             => $validated['cible'] ?? null,
                'coordonnees_gps'   => $validated['coordonnees_gps'] ?? null,
                'date_action'       => $validated['date_action'],
                'photo_jointe'      => $photoPath,
            ]);

            // Auto-decrement stock
            $article->decrement('stock_actuel', $validated['quantite_affectee']);
        });

        return response()->json($affectation->load(['article', 'service']), 201);
    }

    public function show(Affectation $affectation): JsonResponse
    {
        return response()->json($affectation->load(['article', 'service']));
    }

    public function destroy(Affectation $affectation): JsonResponse
    {
        if (! request()->user()->can('gerer_affectations')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // Restore stock on delete
        $affectation->article->increment('stock_actuel', $affectation->quantite_affectee);
        $affectation->delete();

        return response()->json(['message' => 'Affectation supprimée.']);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DemandeApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Demande::with(['utilisateur', 'lignes.article']);

        // Chef_Service ne voit que ses propres demandes
        if ($request->user()->hasRole('Chef_Service') && ! $request->user()->hasRole('Admin')) {
            $query->where('utilisateur_id', $request->user()->id);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $demandes = $query->latest()->paginate($request->integer('per_page', 25));

        return response()->json($demandes);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->can('soumettre_demande')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'date_creation'            => 'required|date',
            'lignes'                   => 'required|array|min:1',
            'lignes.*.article_id'      => 'required|exists:articles,id',
            'lignes.*.quantite_demandee' => 'required|integer|min:1',
            'lignes.*.motif'           => 'nullable|string|max:255',
            'bon_scanne'               => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $demande = null;
        DB::transaction(function () use ($validated, $request, &$demande) {
            $demande = Demande::create([
                'utilisateur_id' => $request->user()->id,
                'date_creation'  => $validated['date_creation'],
                'statut'         => 'En_attente',
            ]);

            foreach ($validated['lignes'] as $ligne) {
                $demande->lignes()->create([
                    'article_id'         => $ligne['article_id'],
                    'quantite_demandee'  => $ligne['quantite_demandee'],
                    'motif'              => $ligne['motif'] ?? null,
                ]);
            }
            
            // Handle media upload
            if ($request->hasFile('bon_scanne')) {
                $demande->addMediaFromRequest('bon_scanne')
                    ->toMediaCollection('bon_scanne');
            }
        });

        $demande->load(['utilisateur', 'lignes.article']);
        $demande->bon_scanne_url = $demande->getFirstMediaUrl('bon_scanne');
        
        return response()->json($demande, 201);
    }

    public function show(Demande $demande): JsonResponse
    {
        $demande->load(['utilisateur', 'lignes.article']);
        $demande->bon_scanne_url = $demande->getFirstMediaUrl('bon_scanne');
        return response()->json($demande);
    }

    public function update(Request $request, Demande $demande): JsonResponse
    {
        if (! $request->user()->can('approuver_demande')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'statut' => ['required', Rule::in(['En_attente', 'Valide', 'Livre'])],
            'bon_scanne' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        // Enforce valid transitions
        $transitions = [
            'En_attente' => ['Valide'],
            'Valide'     => ['Livre'],
            'Livre'      => [],
        ];

        if (! in_array($validated['statut'], $transitions[$demande->statut] ?? [], true)) {
            return response()->json([
                'message' => "Transition invalide: {$demande->statut} → {$validated['statut']}",
            ], 422);
        }

        $demande->update(['statut' => $validated['statut']]);
        
        // Handle media upload
        if ($request->hasFile('bon_scanne')) {
            $demande->clearMediaCollection('bon_scanne');
            $demande->addMediaFromRequest('bon_scanne')
                ->toMediaCollection('bon_scanne');
        }

        $demande->load(['utilisateur', 'lignes.article']);
        $demande->bon_scanne_url = $demande->getFirstMediaUrl('bon_scanne');
        
        return response()->json($demande);
    }

    public function destroy(Demande $demande): JsonResponse
    {
        $demande->delete();

        return response()->json(['message' => 'Demande supprimée.']);
    }
}

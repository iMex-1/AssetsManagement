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
    public function __construct(private readonly FileUploadService $uploads) {}

    public function index(Request $request): JsonResponse
    {
        $query = Demande::with(['utilisateur', 'lignes.article']);

        // Dept_Head sees only their own demandes
        if ($request->user()->hasRole('Dept_Head') && ! $request->user()->hasRole('Admin')) {
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
        if (! $request->user()->can('submit_request')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date_creation'            => 'required|date',
            'lignes'                   => 'required|array|min:1',
            'lignes.*.article_id'      => 'required|exists:articles,id',
            'lignes.*.quantite_demandee' => 'required|integer|min:1',
            'lignes.*.motif'           => 'nullable|string|max:255',
            'bon_scanne'               => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $bonPath = null;
        if ($request->hasFile('bon_scanne')) {
            $bonPath = $this->uploads->storeBonScanne($request->file('bon_scanne'));
        }

        DB::transaction(function () use ($validated, $bonPath, $request, &$demande) {
            $demande = Demande::create([
                'utilisateur_id' => $request->user()->id,
                'date_creation'  => $validated['date_creation'],
                'statut'         => 'En_attente',
                'bon_scanne'     => $bonPath,
            ]);

            foreach ($validated['lignes'] as $ligne) {
                $demande->lignes()->create([
                    'article_id'         => $ligne['article_id'],
                    'quantite_demandee'  => $ligne['quantite_demandee'],
                    'motif'              => $ligne['motif'] ?? null,
                ]);
            }
        });

        return response()->json($demande->load(['utilisateur', 'lignes.article']), 201);
    }

    public function show(Demande $demande): JsonResponse
    {
        return response()->json($demande->load(['utilisateur', 'lignes.article']));
    }

    public function update(Request $request, Demande $demande): JsonResponse
    {
        if (! $request->user()->can('approve_request')) {
            return response()->json(['message' => 'Unauthorized'], 403);
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

        if ($request->hasFile('bon_scanne')) {
            $validated['bon_scanne'] = $this->uploads->storeBonScanne($request->file('bon_scanne'));
        }

        $demande->update(['statut' => $validated['statut'], 'bon_scanne' => $validated['bon_scanne'] ?? $demande->bon_scanne]);

        return response()->json($demande->load(['utilisateur', 'lignes.article']));
    }

    public function destroy(Demande $demande): JsonResponse
    {
        $demande->delete();

        return response()->json(['message' => 'Demande supprimée.']);
    }
}

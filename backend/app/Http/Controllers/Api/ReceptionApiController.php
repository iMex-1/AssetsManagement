<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Reception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReceptionApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $receptions = Reception::with(['fournisseur', 'lignes.article'])
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return response()->json($receptions);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'fournisseur_id'   => 'required|exists:fournisseurs,id',
            'type_doc'         => 'required|in:Marche,Bon de Commande',
            'date_reception'   => 'required|date',
            'lignes'           => 'required|array|min:1',
            'lignes.*.article_id'              => 'nullable|exists:articles,id',
            'lignes.*.quantite_recue'          => 'required|integer|min:1',
            'lignes.*.prix_unitaire'           => 'required|numeric|min:0',
            // New article inline creation fields
            'lignes.*.article_data.designation' => 'required_without:lignes.*.article_id|string|max:255',
            'lignes.*.article_data.categorie'   => 'required_without:lignes.*.article_id|in:Materiel,Fourniture',
            'lignes.*.article_data.seuil_alerte'=> 'nullable|integer|min:0',
        ]);

        // Auto-generate document number: REC-YYYYMM-XXXX
        $yearMonth = now()->format('Ym');
        $count = Reception::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count() + 1;
        $numeroDoc = 'REC-' . $yearMonth . '-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);

        DB::transaction(function () use ($validated, $numeroDoc, &$reception) {
            $reception = Reception::create([
                'fournisseur_id' => $validated['fournisseur_id'],
                'type_doc'       => $validated['type_doc'],
                'numero_doc'     => $numeroDoc,
                'date_reception' => $validated['date_reception'],
            ]);

            foreach ($validated['lignes'] as $ligne) {
                // If article_id is missing, create the article inline
                if (empty($ligne['article_id']) && !empty($ligne['article_data'])) {
                    $articleData = $ligne['article_data'];
                    
                    // Materiel has no alert threshold
                    if (($articleData['categorie'] ?? '') === 'Materiel') {
                        $articleData['seuil_alerte'] = null;
                    }
                    
                    $articleData['stock_actuel'] = 0; // Will be incremented below
                    
                    $article = Article::create($articleData);
                    $ligne['article_id'] = $article->id;
                }

                $reception->lignes()->create([
                    'article_id'     => $ligne['article_id'],
                    'quantite_recue' => $ligne['quantite_recue'],
                    'prix_unitaire'  => $ligne['prix_unitaire'],
                ]);

                // Auto-increment stock
                Article::where('id', $ligne['article_id'])
                    ->increment('stock_actuel', $ligne['quantite_recue']);
            }
        });

        return response()->json($reception->load(['fournisseur', 'lignes.article']), 201);
    }

    public function show(Reception $reception): JsonResponse
    {
        return response()->json($reception->load(['fournisseur', 'lignes.article']));
    }

    public function destroy(Reception $reception): JsonResponse
    {
        if (! request()->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $reception->delete();

        return response()->json(['message' => 'Réception supprimée.']);
    }
}

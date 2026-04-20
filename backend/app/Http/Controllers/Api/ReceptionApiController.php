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
        if (! $request->user()->can('manage_items')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'fournisseur_id'   => 'required|exists:fournisseurs,id',
            'type_doc'         => 'required|in:Marche,Bon de Commande',
            'numero_doc'       => 'required|string|max:100',
            'date_reception'   => 'required|date',
            'lignes'           => 'required|array|min:1',
            'lignes.*.article_id'     => 'required|exists:articles,id',
            'lignes.*.quantite_recue' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, &$reception) {
            $reception = Reception::create([
                'fournisseur_id' => $validated['fournisseur_id'],
                'type_doc'       => $validated['type_doc'],
                'numero_doc'     => $validated['numero_doc'],
                'date_reception' => $validated['date_reception'],
            ]);

            foreach ($validated['lignes'] as $ligne) {
                $reception->lignes()->create([
                    'article_id'     => $ligne['article_id'],
                    'quantite_recue' => $ligne['quantite_recue'],
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
        if (! request()->user()->can('manage_items')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reception->delete();

        return response()->json(['message' => 'Réception supprimée.']);
    }
}

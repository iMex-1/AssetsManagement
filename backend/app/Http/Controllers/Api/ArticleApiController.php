<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();

        if ($request->filled('search')) {
            $query->where('designation', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('categorie')) {
            $query->where('categorie', $request->categorie);
        }

        $articles = $query->latest()->paginate($request->integer('per_page', 25));

        return response()->json($articles);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'designation'  => 'required|string|max:255',
            'categorie'    => 'required|in:Materiel,Fourniture',
            'stock_actuel' => 'required|integer|min:0',
            'seuil_alerte' => 'nullable|integer|min:0',
        ]);

        // Materiel has no alert threshold
        if (($validated['categorie'] ?? '') === 'Materiel') {
            $validated['seuil_alerte'] = null;
        }

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    public function show(Article $article): JsonResponse
    {
        return response()->json($article);
    }

    public function update(Request $request, Article $article): JsonResponse
    {
        if (! $request->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'designation'  => 'sometimes|string|max:255',
            'categorie'    => 'sometimes|in:Materiel,Fourniture',
            'stock_actuel' => 'sometimes|integer|min:0',
            'seuil_alerte' => 'nullable|integer|min:0',
        ]);

        // Materiel has no alert threshold
        $categorie = $validated['categorie'] ?? $article->categorie;
        if ($categorie === 'Materiel') {
            $validated['seuil_alerte'] = null;
        }

        $article->update($validated);

        return response()->json($article);
    }

    public function destroy(Article $article): JsonResponse
    {
        if (! request()->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $article->delete();

        return response()->json(['message' => 'Article archivé.']);
    }

    public function archived(Request $request): JsonResponse
    {
        $query = Article::onlyTrashed();

        if ($request->filled('search')) {
            $query->where('designation', 'like', '%' . $request->search . '%');
        }

        $articles = $query->latest('deleted_at')->paginate($request->integer('per_page', 25));

        return response()->json($articles);
    }

    public function restore(int $id): JsonResponse
    {
        if (! request()->user()->can('gerer_articles')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $article = Article::onlyTrashed()->findOrFail($id);
        $article->restore();

        return response()->json($article);
    }
}

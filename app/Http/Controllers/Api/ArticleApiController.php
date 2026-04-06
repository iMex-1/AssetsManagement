<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleApiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Article::query();

        if ($request->filled('categorie')) {
            $query->where('categorie', $request->input('categorie'));
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('stock_actuel', '<=', 'seuil_alerte');
        }

        return ArticleResource::collection($query->paginate(25));
    }

    public function store(StoreArticleRequest $request): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $article = Article::create($request->validated());

        return response()->json([
            'data'    => new ArticleResource($article),
            'message' => 'Article created successfully.',
            'status'  => 201,
        ], 201);
    }

    public function show(Article $article): JsonResponse
    {
        return response()->json([
            'data'    => new ArticleResource($article),
            'message' => 'OK',
            'status'  => 200,
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $article->update($request->validated());

        return response()->json([
            'data'    => new ArticleResource($article),
            'message' => 'Article updated successfully.',
            'status'  => 200,
        ]);
    }

    public function destroy(Request $request, Article $article): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $article->delete();

        return response()->json(null, 204);
    }
}

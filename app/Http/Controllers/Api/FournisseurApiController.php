<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FournisseurApiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Fournisseur::query();

        if ($request->filled('search')) {
            $query->where('raison_sociale', 'like', '%' . $request->input('search') . '%');
        }

        return FournisseurResource::collection($query->paginate(25));
    }

    public function store(StoreFournisseurRequest $request): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $fournisseur = Fournisseur::create($request->validated());

        return response()->json([
            'data'    => new FournisseurResource($fournisseur),
            'message' => 'Fournisseur created successfully.',
            'status'  => 201,
        ], 201);
    }

    public function show(Fournisseur $fournisseur): JsonResponse
    {
        return response()->json([
            'data'    => new FournisseurResource($fournisseur),
            'message' => 'OK',
            'status'  => 200,
        ]);
    }

    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $fournisseur->update($request->validated());

        return response()->json([
            'data'    => new FournisseurResource($fournisseur),
            'message' => 'Fournisseur updated successfully.',
            'status'  => 200,
        ]);
    }

    public function destroy(Request $request, Fournisseur $fournisseur): JsonResponse
    {
        if (!$request->user()->can('manage_items')) {
            return response()->json(['message' => 'Forbidden', 'status' => 403], 403);
        }

        $fournisseur->delete();

        return response()->json(null, 204);
    }
}

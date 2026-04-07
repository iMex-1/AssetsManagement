<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FournisseurApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fournisseurs = Fournisseur::latest()->paginate($request->integer('per_page', 25));

        return response()->json($fournisseurs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'telephone'      => 'nullable|string|max:20',
        ]);

        $fournisseur = Fournisseur::create($validated);

        return response()->json($fournisseur, 201);
    }

    public function show(Fournisseur $fournisseur): JsonResponse
    {
        return response()->json($fournisseur);
    }

    public function update(Request $request, Fournisseur $fournisseur): JsonResponse
    {
        $validated = $request->validate([
            'raison_sociale' => 'sometimes|string|max:255',
            'telephone'      => 'nullable|string|max:20',
        ]);

        $fournisseur->update($validated);

        return response()->json($fournisseur);
    }

    public function destroy(Fournisseur $fournisseur): JsonResponse
    {
        $fournisseur->delete();

        return response()->json(['message' => 'Fournisseur supprimé.']);
    }
}

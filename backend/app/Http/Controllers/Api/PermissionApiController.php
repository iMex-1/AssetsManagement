<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionApiController extends Controller
{
    public function index(): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $permissions = Permission::orderBy('name')->get();

        return response()->json(['data' => $permissions]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name|max:255',
        ]);

        $permission = Permission::create(['name' => $validated['name'], 'guard_name' => 'web']);

        return response()->json($permission, 201);
    }

    public function show(Permission $permission): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json($permission);
    }

    public function update(Request $request, Permission $permission): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id . '|max:255',
        ]);

        $permission->update(['name' => $validated['name']]);

        return response()->json($permission);
    }

    public function destroy(Permission $permission): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $permission->delete();

        return response()->json(['message' => 'Permission supprimée.']);
    }
}

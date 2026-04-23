<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleApiController extends Controller
{
    public function index(): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $roles = Role::with('permissions')->get();

        return response()->json(['data' => $roles]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'name'        => 'required|string|unique:roles,name|max:255',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);

        if (! empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function show(Role $role): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json($role->load('permissions'));
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|unique:roles,name,' . $role->id . '|max:255',
            'permissions' => 'nullable|array',
        ]);

        if (isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }

        if (array_key_exists('permissions', $validated)) {
            $role->syncPermissions($validated['permissions'] ?? []);
        }

        return response()->json($role->load('permissions'));
    }

    public function destroy(Role $role): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Rôle supprimé.']);
    }
}

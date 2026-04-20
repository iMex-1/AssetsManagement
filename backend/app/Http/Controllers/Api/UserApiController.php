<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with('roles')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        $users->getCollection()->transform(fn ($u) => $this->format($u));

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'nom_complet'           => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'service_id'            => 'nullable|exists:services,id',
            'roles'                 => 'nullable|array',
        ]);

        $user = User::create([
            'nom_complet' => $validated['nom_complet'],
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'service_id'  => $validated['service_id'] ?? null,
        ]);

        if (! empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return response()->json($this->format($user->load('roles')), 201);
    }

    public function show(User $user): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($this->format($user->load('roles')));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        if (! $request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'nom_complet'           => 'sometimes|string|max:255',
            'email'                 => 'sometimes|email|unique:users,email,' . $user->id,
            'password'              => 'nullable|string|min:8|confirmed',
            'service_id'            => 'nullable|exists:services,id',
            'roles'                 => 'nullable|array',
        ]);

        $user->update(array_filter([
            'nom_complet' => $validated['nom_complet'] ?? null,
            'email'       => $validated['email'] ?? null,
            'service_id'  => array_key_exists('service_id', $validated) ? $validated['service_id'] : $user->service_id,
            'password'    => ! empty($validated['password']) ? Hash::make($validated['password']) : null,
        ], fn ($v) => $v !== null));

        if (array_key_exists('roles', $validated)) {
            $user->syncRoles($validated['roles'] ?? []);
        }

        return response()->json($this->format($user->load('roles')));
    }

    public function destroy(User $user): JsonResponse
    {
        if (! request()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    private function format(User $user): array
    {
        return [
            'id'          => $user->id,
            'nom_complet' => $user->nom_complet,
            'email'       => $user->email,
            'service_id'  => $user->service_id,
            'roles'       => $user->getRoleNames(),
        ];
    }
}

<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PermissionApiController;
use App\Http\Controllers\Api\RoleApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::apiResource('users', UserApiController::class)->names([
        'index' => 'api.users.index',
        'store' => 'api.users.store',
        'show' => 'api.users.show',
        'update' => 'api.users.update',
        'destroy' => 'api.users.destroy',
    ]);
    Route::apiResource('roles', RoleApiController::class)->names([
        'index' => 'api.roles.index',
        'store' => 'api.roles.store',
        'show' => 'api.roles.show',
        'update' => 'api.roles.update',
        'destroy' => 'api.roles.destroy',
    ]);
    Route::apiResource('permissions', PermissionApiController::class)->names([
        'index' => 'api.permissions.index',
        'store' => 'api.permissions.store',
        'show' => 'api.permissions.show',
        'update' => 'api.permissions.update',
        'destroy' => 'api.permissions.destroy',
    ]);
});

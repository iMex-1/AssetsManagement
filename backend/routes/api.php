<?php

use App\Http\Controllers\Api\AffectationApiController;
use App\Http\Controllers\Api\ArticleApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DemandeApiController;
use App\Http\Controllers\Api\FournisseurApiController;
use App\Http\Controllers\Api\PermissionApiController;
use App\Http\Controllers\Api\ReceptionApiController;
use App\Http\Controllers\Api\RoleApiController;
use App\Http\Controllers\Api\ServiceApiController;
use App\Http\Controllers\Api\StatsApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Catalog
    Route::apiResource('articles', ArticleApiController::class);
    Route::apiResource('fournisseurs', FournisseurApiController::class);

    // Procurement
    Route::apiResource('receptions', ReceptionApiController::class)->except(['update']);

    // Requisitions
    Route::apiResource('demandes', DemandeApiController::class);

    // Assignments
    Route::apiResource('affectations', AffectationApiController::class)->except(['update']);

    // Services (read-only)
    Route::get('services', [ServiceApiController::class, 'index']);

    // Stats / Reports
    Route::get('stats', [StatsApiController::class, 'index']);

    // Admin
    Route::apiResource('users', UserApiController::class);
    Route::apiResource('roles', RoleApiController::class);
    Route::apiResource('permissions', PermissionApiController::class);
});

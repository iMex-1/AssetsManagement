# Implementation Plan: PublicAsset OS — Week 1

## Overview

Incremental implementation across 8 requirements: RBAC cleanup, soft deletes on 5 models, a reusable FileUploadService, full CRUD API + Blade views for Articles and Fournisseurs, and code quality enforcement. Each task builds on the previous and ends with everything wired together.

## Tasks

- [x] 1. RBAC cleanup — eliminate legacy role-string checks
  - [x] 1.1 Update `CheckPermission` middleware to use only `$request->user()->can($permission)`
    - Remove any `$user->role` string comparisons; keep only the `can()` check already present
    - Add `declare(strict_types=1);` if missing
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Deprecate `role` field in `User` model `$fillable`
    - Add `@deprecated` PHPDoc comment on the `role` entry in `$fillable` stating it is a display label only
    - _Requirements: 1.3_
  - [x] 1.3 Update `RolePermissionSeeder` to match the required permission matrix
    - Ensure exactly three roles (`Admin`, `Dept_Head`, `Overseer`) with `guard_name = 'web'`
    - Admin: all 11 permissions; Dept_Head: `submit_request`, `confirm_receipt`, `report_damage`, `view_own_dept`; Overseer: `view_reports`, `view_own_dept`
    - Call `forgetCachedPermissions()` before any role/permission creation
    - Use `firstOrCreate` for all records
    - _Requirements: 1.4, 1.5, 1.6, 1.7_
  - [ ]* 1.4 Write unit tests for `RolePermissionSeeder` idempotency
    - Assert running the seeder twice produces no duplicate roles or permissions
    - Assert each role has exactly the correct permissions
    - _Requirements: 1.4, 1.5, 1.7_

- [x] 2. Add soft deletes to five models
  - [x] 2.1 Create migration files adding `deleted_at` to `articles`, `fournisseurs`, `receptions`, `demandes`, `affectations`
    - One migration per table (five new files); do NOT modify existing migrations
    - Use `$table->softDeletes()` / `$table->dropSoftDeletes()` with up/down
    - _Requirements: 2.1_
  - [x] 2.2 Add `SoftDeletes` trait to `Article`, `Fournisseur`, `Reception`, `Demande`, `Affectation` models
    - Import `Illuminate\Database\Eloquent\SoftDeletes` in each model
    - Do NOT add it to `LigneReception` or `LigneDemande`
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - [ ]* 2.3 Write unit tests confirming soft-delete behaviour
    - Assert that a deleted Article is excluded from default queries
    - Assert `withTrashed()` returns the deleted record
    - Assert `LigneReception` and `LigneDemande` do NOT have a `deleted_at` column
    - _Requirements: 2.7, 2.8_

- [x] 3. Implement `FileUploadService`
  - [x] 3.1 Create `app/Services/FileUploadService.php`
    - `declare(strict_types=1);`, constructor property promotion, `readonly` where applicable
    - `storeBonScanne(UploadedFile $file): string` — allowed MIME: `application/pdf`, `image/jpeg`, `image/png`; path `bons/{Y/m}/`
    - `storePhotoJointe(UploadedFile $file): string` — allowed MIME: `image/jpeg`, `image/png`, `image/webp`; path `photos/{Y/m}/`
    - Both methods: validate max 5120 KB, throw `ValidationException` on size or MIME violation, generate UUID filename preserving extension
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_
  - [x] 3.2 Register `FileUploadService` as a singleton in `AppServiceProvider::register()`
    - `$this->app->singleton(FileUploadService::class)`
    - _Requirements: 3.10_
  - [ ]* 3.3 Write unit tests for `FileUploadService`
    - Test `storeBonScanne` rejects disallowed MIME types and oversized files
    - Test `storePhotoJointe` rejects disallowed MIME types and oversized files
    - Test UUID filename generation preserves extension
    - Test correct storage path pattern (`bons/YYYY/MM/` and `photos/YYYY/MM/`)
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [x] 4. Checkpoint — Ensure all tests pass
  - Run `php artisan test` and `./vendor/bin/pint --test`; resolve any failures before continuing.

- [x] 5. Articles API — FormRequests and Resource
  - [x] 5.1 Create `app/Http/Requests/StoreArticleRequest.php`
    - `declare(strict_types=1);`, extend `FormRequest`
    - Rules: `designation` required string, `categorie` required in `[Materiel, Fourniture]`, `stock_actuel` required integer min 0, `seuil_alerte` required integer min 0
    - _Requirements: 4.12_
  - [x] 5.2 Create `app/Http/Requests/UpdateArticleRequest.php`
    - Same rules as `StoreArticleRequest` but all fields `sometimes`
    - _Requirements: 4.13_
  - [x] 5.3 Create `app/Http/Resources/ArticleResource.php`
    - Include all model fields plus computed `is_low_stock` boolean (`stock_actuel <= seuil_alerte`)
    - _Requirements: 4.8_

- [x] 6. Articles API — Controller and routes
  - [x] 6.1 Create `app/Http/Controllers/Api/ArticleApiController.php`
    - `declare(strict_types=1);`, constructor property promotion
    - `index`: paginate 25, filter by `categorie` and `low_stock=1` query params
    - `store`: use `StoreArticleRequest`, return `ArticleResource` in JSON_envelope, HTTP 201
    - `show`: return `ArticleResource` in JSON_envelope
    - `update`: use `UpdateArticleRequest`, partial update, return JSON_envelope
    - `destroy`: soft-delete, return HTTP 204 no body
    - Gate write actions (`store`, `update`, `destroy`) with `manage_items` permission → 403 if missing
    - All responses use `{ "data": ..., "message": "...", "status": ... }` envelope
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.9, 4.10, 4.11_
  - [x] 6.2 Register API routes for Articles in `routes/api.php`
    - Under `auth:sanctum` middleware group: `Route::apiResource('articles', ArticleApiController::class)`
    - _Requirements: 4.10_
  - [ ]* 6.3 Write feature tests for Articles API
    - Test index pagination and filters (`categorie`, `low_stock`)
    - Test store/update/destroy require `manage_items` permission (403 without it)
    - Test unauthenticated requests return 401
    - Test destroy returns 204 and record is soft-deleted
    - _Requirements: 4.2, 4.3, 4.4, 4.7, 4.9, 4.10_

- [x] 7. Fournisseurs API — FormRequests, Resource, Controller, and routes
  - [x] 7.1 Create `app/Http/Requests/StoreFournisseurRequest.php` and `UpdateFournisseurRequest.php`
    - `StoreFournisseurRequest`: `raison_sociale` required string max 255, `telephone` optional string max 20
    - `UpdateFournisseurRequest`: all fields `sometimes`, same rules
    - _Requirements: 5.10, 5.11_
  - [x] 7.2 Create `app/Http/Resources/FournisseurResource.php`
    - Include all model fields
    - _Requirements: 5.9_
  - [x] 7.3 Create `app/Http/Controllers/Api/FournisseurApiController.php`
    - `index`: paginate 25, filter by `search` param on `raison_sociale` (case-insensitive `LIKE`)
    - `store`: use `StoreFournisseurRequest`, return `FournisseurResource` in JSON_envelope, HTTP 201
    - `show`: return `FournisseurResource` in JSON_envelope
    - `update`: use `UpdateFournisseurRequest`, return JSON_envelope
    - `destroy`: soft-delete, return HTTP 204
    - Gate write actions with `manage_items` permission → 403
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_
  - [x] 7.4 Register API routes for Fournisseurs in `routes/api.php`
    - Under `auth:sanctum` middleware group: `Route::apiResource('fournisseurs', FournisseurApiController::class)`
    - _Requirements: 5.8_
  - [ ]* 7.5 Write feature tests for Fournisseurs API
    - Test search filter on `raison_sociale`
    - Test write operations require `manage_items` (403 without it)
    - Test unauthenticated requests return 401
    - Test destroy returns 204 and record is soft-deleted
    - _Requirements: 5.3, 5.6, 5.7, 5.8_

- [x] 8. Checkpoint — Ensure all tests pass
  - Run `php artisan test` and `./vendor/bin/pint --test`; resolve any failures before continuing.

- [x] 9. Articles Blade views
  - [x] 9.1 Create `app/Http/Controllers/ArticleController.php`
    - `declare(strict_types=1);`, all 7 resource actions (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`)
    - `index`: pass articles to view; `store`/`update`: use `StoreArticleRequest`/`UpdateArticleRequest`, redirect to index on success, redirect back with errors on failure
    - `destroy`: soft-delete, redirect to index
    - Use `$request->validated()` exclusively
    - _Requirements: 6.1, 6.5, 6.6_
  - [x] 9.2 Create Blade views: `resources/views/articles/index.blade.php`, `create.blade.php`, `edit.blade.php`, `show.blade.php`
    - All extend `layouts.app`
    - `index`: show low-stock badge (e.g. red `span`) when `stock_actuel <= seuil_alerte`
    - `create`/`edit`: form with fields for `designation`, `categorie` (select), `stock_actuel`, `seuil_alerte`; show validation errors
    - _Requirements: 6.2, 6.4_
  - [x] 9.3 Register web routes for Articles in `routes/web.php`
    - Inside the existing `auth` middleware group: `Route::resource('articles', ArticleController::class)`
    - _Requirements: 6.3_

- [x] 10. Fournisseurs Blade views
  - [x] 10.1 Create `app/Http/Controllers/FournisseurController.php`
    - `declare(strict_types=1);`, actions: `index`, `create`, `store`, `edit`, `update`
    - `store`/`update`: use `StoreFournisseurRequest`/`UpdateFournisseurRequest`, redirect to index on success, redirect back with errors on failure
    - Use `$request->validated()` exclusively
    - _Requirements: 7.1, 7.4, 7.5_
  - [x] 10.2 Create Blade views: `resources/views/fournisseurs/index.blade.php`, `create.blade.php`, `edit.blade.php`
    - All extend `layouts.app`
    - Forms for `raison_sociale` and `telephone`; show validation errors
    - _Requirements: 7.3_
  - [x] 10.3 Register web routes for Fournisseurs in `routes/web.php`
    - Inside the existing `auth` middleware group: `Route::resource('fournisseurs', FournisseurController::class)`
    - _Requirements: 7.2_

- [x] 11. Final checkpoint — Ensure all tests pass and style is clean
  - Run `php artisan test` — zero failing tests
  - Run `./vendor/bin/pint` — zero style violations
  - Verify every new PHP file has `declare(strict_types=1);`, constructor property promotion where applicable, and uses `$request->validated()` exclusively
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All new PHP files must have `declare(strict_types=1);` at the top (Requirement 8.1)
- Use `$request->validated()` exclusively — never `$request->all()` or `$request->only()` (Requirement 8.4)
- JSON_envelope format: `{ "data": ..., "message": "...", "status": 200 }`
- Soft-delete migrations must be new files; existing migrations must not be modified (Requirement 2.1)

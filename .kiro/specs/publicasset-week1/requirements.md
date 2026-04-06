# Requirements Document

## Introduction

This document covers the Week 1 implementation tasks for PublicAsset OS — a Laravel 13 / PHP 8.3 asset management system for public-sector offices. The foundation (migrations, models, RBAC, auth) is already in place. Week 1 delivers: RBAC cleanup to eliminate legacy role-string checks, soft-delete support on five critical models, a reusable file upload service, full CRUD API and Blade views for Articles and Fournisseurs.

All code must comply with the project's non-negotiable coding standards: PHP 8.3 strict types, constructor property promotion, `readonly` where applicable, FormRequest validation, consistent JSON envelopes, Spatie permission gates, PSR-12 (Pint), Eloquent-only queries, and `$request->validated()` exclusively.

---

## Glossary

- **System**: The PublicAsset OS Laravel application
- **RBAC_System**: The Spatie Laravel-Permission layer (`HasRoles`, `can()`, `permission:` middleware)
- **CheckPermission**: The `App\Http\Middleware\CheckPermission` middleware
- **RolePermissionSeeder**: `database/seeders/RolePermissionSeeder.php`
- **User_Model**: `App\Models\User` Eloquent model
- **Article**: An item in the catalog (`App\Models\Article`), with `designation`, `categorie`, `stock_actuel`, `seuil_alerte`
- **Fournisseur**: A supplier record (`App\Models\Fournisseur`), with `raison_sociale` and `telephone`
- **Reception**: A procurement receipt (`App\Models\Reception`)
- **Demande**: A requisition request (`App\Models\Demande`)
- **Affectation**: An assignment/delivery record (`App\Models\Affectation`)
- **LigneReception**: A receipt line item — must NOT receive soft deletes
- **LigneDemande**: A request line item — must NOT receive soft deletes
- **FileUploadService**: `App\Services\FileUploadService` — handles validated file storage
- **ArticleApiController**: `App\Http\Controllers\Api\ArticleApiController`
- **FournisseurApiController**: `App\Http\Controllers\Api\FournisseurApiController`
- **ArticleController**: `App\Http\Controllers\ArticleController` (web/Blade)
- **FournisseurController**: `App\Http\Controllers\FournisseurController` (web/Blade)
- **ArticleResource**: `App\Http\Resources\ArticleResource` — JSON API resource
- **FournisseurResource**: `App\Http\Resources\FournisseurResource` — JSON API resource
- **StoreArticleRequest**: `App\Http\Requests\StoreArticleRequest`
- **UpdateArticleRequest**: `App\Http\Requests\UpdateArticleRequest`
- **StoreFournisseurRequest**: `App\Http\Requests\StoreFournisseurRequest`
- **UpdateFournisseurRequest**: `App\Http\Requests\UpdateFournisseurRequest`
- **low_stock**: Condition where `stock_actuel <= seuil_alerte` on an Article
- **bon_scanne**: A scanned requisition slip file (PDF/JPEG/PNG, max 5 MB)
- **photo_jointe**: A proof-of-installation photo file (JPEG/PNG/WEBP, max 5 MB)
- **UUID_filename**: A filename generated using `Str::uuid()` preserving the original extension
- **JSON_envelope**: The standard API response shape: `{ "data": ..., "message": "...", "status": 200 }`
- **Error_envelope**: The standard API error shape: `{ "message": "...", "errors": {...}, "status": 422 }`

---

## Requirements

### Requirement 1: Eliminate Legacy Role-String Access Control

**User Story:** As an Admin, I want all access control decisions to use Spatie roles and permissions exclusively, so that the system has a single, auditable source of truth for authorization.

#### Acceptance Criteria

1. THE System SHALL contain no code that reads `$user->role` (the string column) for any access control decision, gate check, or conditional logic.
2. THE CheckPermission SHALL evaluate authorization exclusively via `$request->user()->can($permission)`.
3. THE User_Model SHALL mark the `role` entry in `$fillable` with an `@deprecated` PHPDoc comment indicating it is a display label only and must not be used for authorization.
4. THE RolePermissionSeeder SHALL define exactly three roles with `guard_name` set to `web`: `Admin`, `Dept_Head`, and `Overseer`.
5. WHEN the RolePermissionSeeder runs, THE RolePermissionSeeder SHALL assign permissions to roles according to the following matrix — Admin receives all eleven permissions; Dept_Head receives `submit_request`, `confirm_receipt`, `report_damage`, `view_own_dept`; Overseer receives `view_reports`, `view_own_dept`.
6. WHEN the RolePermissionSeeder runs, THE RolePermissionSeeder SHALL call `app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions()` before creating any role or permission.
7. THE RolePermissionSeeder SHALL use `firstOrCreate` for all role and permission records to remain idempotent across repeated runs.

---

### Requirement 2: Soft Deletes on Critical Models

**User Story:** As an Admin, I want deleted records for Articles, Fournisseurs, Receptions, Demandes, and Affectations to be soft-deleted rather than permanently removed, so that audit trails are preserved.

#### Acceptance Criteria

1. THE System SHALL add a `deleted_at` nullable timestamp column to the `articles`, `fournisseurs`, `receptions`, `demandes`, and `affectations` tables via new migration files — existing migrations MUST NOT be modified.
2. THE Article SHALL use the `Illuminate\Database\Eloquent\SoftDeletes` trait.
3. THE Fournisseur SHALL use the `Illuminate\Database\Eloquent\SoftDeletes` trait.
4. THE Reception SHALL use the `Illuminate\Database\Eloquent\SoftDeletes` trait.
5. THE Demande SHALL use the `Illuminate\Database\Eloquent\SoftDeletes` trait.
6. THE Affectation SHALL use the `Illuminate\Database\Eloquent\SoftDeletes` trait.
7. THE System SHALL NOT add `SoftDeletes` to `LigneReception` or `LigneDemande`.
8. WHEN a query is executed on Article, Fournisseur, Reception, Demande, or Affectation without an explicit `withTrashed()` call, THE System SHALL exclude soft-deleted records from the result set automatically.

---

### Requirement 3: File Upload Service

**User Story:** As a developer, I want a centralised file upload service, so that all file storage logic is consistent, validated, and reusable across controllers.

#### Acceptance Criteria

1. THE FileUploadService SHALL expose a public method `storeBonScanne(UploadedFile $file): string` that stores the file and returns its storage path.
2. THE FileUploadService SHALL expose a public method `storePhotoJointe(UploadedFile $file): string` that stores the file and returns its storage path.
3. WHEN `storeBonScanne` is called, THE FileUploadService SHALL accept only files with MIME types `application/pdf`, `image/jpeg`, and `image/png`.
4. WHEN `storePhotoJointe` is called, THE FileUploadService SHALL accept only files with MIME types `image/jpeg`, `image/png`, and `image/webp`.
5. WHEN a file exceeds 5 120 kilobytes, THE FileUploadService SHALL throw a validation exception with a descriptive message before storing the file.
6. WHEN a file has a disallowed MIME type, THE FileUploadService SHALL throw a validation exception with a descriptive message before storing the file.
7. WHEN storing a bon_scanne file, THE FileUploadService SHALL place it under the `bons/{Y/m}/` path where `{Y/m}` is the current year and month.
8. WHEN storing a photo_jointe file, THE FileUploadService SHALL place it under the `photos/{Y/m}/` path where `{Y/m}` is the current year and month.
9. THE FileUploadService SHALL generate a UUID-based filename for every stored file, preserving the original file extension.
10. THE AppServiceProvider SHALL register FileUploadService as a singleton in the service container.

---

### Requirement 4: Articles API (Full CRUD)

**User Story:** As an Admin, I want a RESTful JSON API for Articles, so that catalog items can be managed programmatically by authorised clients.

#### Acceptance Criteria

1. THE ArticleApiController SHALL implement `index`, `store`, `show`, `update`, and `destroy` actions.
2. WHEN `GET /api/articles` is requested, THE ArticleApiController SHALL return a paginated list of Articles with 25 records per page.
3. WHEN `GET /api/articles?categorie={value}` is requested, THE ArticleApiController SHALL filter results to Articles whose `categorie` column matches the provided value.
4. WHEN `GET /api/articles?low_stock=1` is requested, THE ArticleApiController SHALL filter results to Articles where `stock_actuel` is less than or equal to `seuil_alerte`.
5. WHEN `POST /api/articles` is requested, THE ArticleApiController SHALL validate the request body using StoreArticleRequest and create a new Article record.
6. WHEN `PATCH /api/articles/{id}` is requested, THE ArticleApiController SHALL validate the request body using UpdateArticleRequest and apply a partial update to the Article.
7. WHEN `DELETE /api/articles/{id}` is requested, THE ArticleApiController SHALL soft-delete the Article and return HTTP 204 with no body.
8. THE ArticleResource SHALL include an `is_low_stock` boolean field computed as `true` when `stock_actuel <= seuil_alerte`, and `false` otherwise.
9. WHEN a write operation (`store`, `update`, `destroy`) is requested without the `manage_items` permission, THE ArticleApiController SHALL return HTTP 403.
10. WHEN any API endpoint is requested without a valid Sanctum token, THE ArticleApiController SHALL return HTTP 401.
11. THE ArticleApiController SHALL return all success responses using the JSON_envelope format.
12. THE StoreArticleRequest SHALL require `designation` (string), `categorie` (one of `Materiel`, `Fourniture`), `stock_actuel` (integer, min 0), and `seuil_alerte` (integer, min 0).
13. THE UpdateArticleRequest SHALL make all fields optional and apply the same type and value rules as StoreArticleRequest for any field that is present.

---

### Requirement 5: Fournisseurs API (Full CRUD)

**User Story:** As an Admin, I want a RESTful JSON API for Fournisseurs, so that supplier records can be managed programmatically by authorised clients.

#### Acceptance Criteria

1. THE FournisseurApiController SHALL implement `index`, `store`, `show`, `update`, and `destroy` actions.
2. WHEN `GET /api/fournisseurs` is requested, THE FournisseurApiController SHALL return a paginated list of Fournisseurs with 25 records per page.
3. WHEN `GET /api/fournisseurs?search={term}` is requested, THE FournisseurApiController SHALL filter results to Fournisseurs whose `raison_sociale` column contains the search term (case-insensitive).
4. WHEN `POST /api/fournisseurs` is requested, THE FournisseurApiController SHALL validate the request body using StoreFournisseurRequest and create a new Fournisseur record.
5. WHEN `PUT /api/fournisseurs/{id}` is requested, THE FournisseurApiController SHALL validate the request body using UpdateFournisseurRequest and update the Fournisseur record.
6. WHEN `DELETE /api/fournisseurs/{id}` is requested, THE FournisseurApiController SHALL soft-delete the Fournisseur and return HTTP 204 with no body.
7. WHEN a write operation (`store`, `update`, `destroy`) is requested without the `manage_items` permission, THE FournisseurApiController SHALL return HTTP 403.
8. WHEN any API endpoint is requested without a valid Sanctum token, THE FournisseurApiController SHALL return HTTP 401.
9. THE FournisseurApiController SHALL return all success responses using the JSON_envelope format.
10. THE StoreFournisseurRequest SHALL require `raison_sociale` (string, max 255) and allow optional `telephone` (string, max 20).
11. THE UpdateFournisseurRequest SHALL make all fields optional and apply the same type and value rules as StoreFournisseurRequest for any field that is present.

---

### Requirement 6: Articles Blade Views

**User Story:** As an Admin or Dept_Head, I want web UI views for Articles, so that catalog items can be browsed and managed through the browser.

#### Acceptance Criteria

1. THE ArticleController SHALL implement `index`, `create`, `store`, `show`, `edit`, `update`, and `destroy` actions backed by Blade views.
2. WHEN the Articles index page is rendered, THE ArticleController SHALL display a low-stock badge on any Article where `stock_actuel <= seuil_alerte`.
3. THE System SHALL register web routes for Articles under the `auth` middleware group using `Route::resource('articles', ArticleController::class)`.
4. THE System SHALL use the existing shared Blade layout (`layouts.app`) for all Article views.
5. WHEN a user submits the create or edit form, THE ArticleController SHALL validate input using the corresponding FormRequest class and redirect to the index on success.
6. IF a validation error occurs on form submission, THEN THE ArticleController SHALL redirect back with the validation errors and previously entered input.

---

### Requirement 7: Fournisseurs Blade Views

**User Story:** As an Admin, I want web UI views for Fournisseurs, so that supplier records can be browsed and managed through the browser.

#### Acceptance Criteria

1. THE FournisseurController SHALL implement `index`, `create`, `store`, `edit`, and `update` actions backed by Blade views.
2. THE System SHALL register web routes for Fournisseurs under the `auth` middleware group using `Route::resource('fournisseurs', FournisseurController::class)`.
3. THE System SHALL use the existing shared Blade layout (`layouts.app`) for all Fournisseur views.
4. WHEN a user submits the create or edit form, THE FournisseurController SHALL validate input using the corresponding FormRequest class and redirect to the index on success.
5. IF a validation error occurs on form submission, THEN THE FournisseurController SHALL redirect back with the validation errors and previously entered input.

---

### Requirement 8: Code Quality and Test Suite

**User Story:** As a developer, I want the entire Week 1 implementation to pass automated tests and style checks, so that the codebase remains maintainable and regression-free.

#### Acceptance Criteria

1. THE System SHALL declare `declare(strict_types=1);` at the top of every new PHP file produced in Week 1.
2. THE System SHALL use constructor property promotion in every new class where constructor parameters are assigned to properties.
3. THE System SHALL use `readonly` on properties that are set once and never mutated.
4. THE System SHALL use `$request->validated()` exclusively — never `$request->all()` or `$request->only()` — in all new controllers and FormRequests.
5. WHEN `php artisan test` is executed, THE System SHALL report zero failing tests.
6. WHEN `./vendor/bin/pint` is executed, THE System SHALL report zero style violations.

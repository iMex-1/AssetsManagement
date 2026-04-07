# PublicAsset OS — Complete Project Overview

> A high-accountability asset and consumable management system for public offices, built with Laravel 13.
> Tracks the full lifecycle of physical items — from supplier procurement through internal distribution, assignment, and delivery confirmation.

---

## 1. Project Description

PublicAsset OS is designed for public-sector offices (municipalities, government departments, etc.) that need strict traceability over physical goods. The system manages two categories of items:

- **Matériel** (Equipment): Durable physical assets like vehicles, computers, furniture
- **Fourniture** (Consumables): Bulk supplies like paper, ink, spare parts

The core workflow is:
1. Items are received from suppliers via formal procurement documents (Marché or Bon de Commande)
2. Department heads submit requests for items they need
3. Requests are validated by the warehouse manager (Magasinier)
4. Items are physically dispatched and assigned to a service/department
5. Assignments include proof of delivery (photo, GPS coordinates for field installations)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | PHP 8.3 |
| Framework | Laravel 13 |
| Database | MySQL |
| Templating | Blade (web UI) |
| API Auth | Laravel Sanctum ^4.0 (Bearer tokens) |
| RBAC | Spatie Laravel-Permission ^7.2 |
| Asset Bundling | Vite |
| Testing | PHPUnit ^12.5 |
| Code Style | Laravel Pint (PSR-12) |
| Dev Tools | Laravel Tinker, Laravel Pail |

---

## 3. Roles & Permissions (RBAC)

Roles are managed via Spatie Laravel-Permission with `guard_name: 'web'`.

### Roles

| Role | Description |
|------|-------------|
| `Admin` | Full system access |
| `Magasinier` | Warehouse manager — validates requests, manages stock |
| `Chef` | Department head — submits requests, views own department |

> Note: The `User` model has both a `role` string column (legacy/simple reference) and Spatie roles via `HasRoles` trait.

### Permissions

| Permission | Description |
|-----------|-------------|
| `manage_categories` | Create/edit item categories |
| `manage_items` | Manage the item catalog |
| `submit_request` | Submit a requisition (demande) |
| `approve_request` | Validate/approve requests |
| `confirm_receipt` | Confirm delivery of items |
| `manage_assets` | Add/edit/retire assets |
| `report_damage` | Mark items as damaged |
| `manage_consumables` | Update consumable stock levels |
| `manage_assignments` | Assign items to departments |
| `view_reports` | View global reports and dashboards |
| `view_own_dept` | View own department's data only |

### Role → Permission Matrix

| Permission | Admin | Dept_Head | Overseer |
|-----------|-------|-----------|---------|
| manage_categories | ✓ | | |
| manage_items | ✓ | | |
| submit_request | ✓ | ✓ | |
| approve_request | ✓ | | |
| confirm_receipt | ✓ | ✓ | |
| manage_assets | ✓ | | |
| report_damage | ✓ | ✓ | |
| manage_consumables | ✓ | | |
| manage_assignments | ✓ | | |
| view_reports | ✓ | | ✓ |
| view_own_dept | ✓ | ✓ | ✓ |

---

## 4. Database Schema

### `services`
Represents internal departments or operational units.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| nom_service | string | e.g., "Eclairage", "Mecanique" |
| created_at / updated_at | timestamps | |

---

### `users`
System users, each optionally belonging to a service.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| service_id | bigint FK → services | nullable, set null on delete |
| nom_complet | string | Full name |
| email | string unique | |
| role | string | "Admin", "Magasinier", "Chef" (default: Magasinier) |
| email_verified_at | timestamp nullable | |
| password | string | bcrypt hashed |
| remember_token | string | |
| created_at / updated_at | timestamps | |

Also creates: `password_reset_tokens`, `sessions` tables.

---

### `fournisseurs` (Suppliers)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| raison_sociale | string | Company/supplier name |
| telephone | string nullable | |
| created_at / updated_at | timestamps | |

---

### `articles` (Item Catalog)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| designation | string | Item name/description |
| categorie | string | "Materiel" or "Fourniture" |
| stock_actuel | integer | Current stock level (auto-updated) |
| seuil_alerte | integer | Low-stock alert threshold |
| created_at / updated_at | timestamps | |

---

### `receptions` (Procurement Receipts)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| fournisseur_id | bigint FK → fournisseurs | cascade delete |
| type_doc | string | "Marche" or "Bon de Commande" |
| numero_doc | string | Document reference number |
| date_reception | date | |
| created_at / updated_at | timestamps | |

---

### `ligne_receptions` (Receipt Line Items)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| reception_id | bigint FK → receptions | cascade delete |
| article_id | bigint FK → articles | cascade delete |
| quantite_recue | integer | Quantity received |
| created_at / updated_at | timestamps | |

---

### `demandes` (Requisition Requests)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| utilisateur_id | bigint FK → users | cascade delete |
| date_creation | date | |
| statut | string | "En_attente", "Valide", "Livre" (default: En_attente) |
| bon_scanne | string | File URL — scanned requisition slip (required) |
| created_at / updated_at | timestamps | |

---

### `ligne_demandes` (Request Line Items)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| demande_id | bigint FK → demandes | cascade delete |
| article_id | bigint FK → articles | cascade delete |
| quantite_demandee | integer | Quantity requested |
| motif | string nullable | Justification/reason |
| created_at / updated_at | timestamps | |

---

### `affectations` (Assignments / Deliveries)

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| article_id | bigint FK → articles | cascade delete |
| service_id | bigint FK → services | cascade delete |
| quantite_affectee | integer | Quantity assigned |
| cible | string nullable | Target identifier (vehicle plate, office, pole number) |
| coordonnees_gps | string nullable | GPS coordinates (for field/lighting installations) |
| photo_jointe | string nullable | File URL — proof of installation photo |
| date_action | date | |
| created_at / updated_at | timestamps | |

---

### Spatie Permission Tables (auto-generated)
- `roles` — role definitions
- `permissions` — permission definitions
- `model_has_roles` — pivot: user ↔ role
- `model_has_permissions` — pivot: user ↔ permission (direct)
- `role_has_permissions` — pivot: role ↔ permission

### Sanctum Tables
- `personal_access_tokens` — API tokens

---

## 5. Entity Relationship Summary

```
services ──< users ──< demandes ──< ligne_demandes >── articles
                                                           │
fournisseurs ──< receptions ──< ligne_receptions >─────────┤
                                                           │
services ──< affectations >────────────────────────────────┘
```

- A `Service` has many `Users` and many `Affectations`
- A `User` belongs to a `Service` and submits many `Demandes`
- A `Demande` has many `LigneDemandes`, each referencing an `Article`
- A `Reception` (from a `Fournisseur`) has many `LigneReceptions`, each referencing an `Article`
- An `Affectation` links an `Article` to a `Service` with delivery proof

---

## 6. Models & Relationships

### `User`
- `belongsTo` Service
- `hasMany` Demandes
- Traits: `HasApiTokens`, `HasRoles`, `Notifiable`

### `Service`
- `hasMany` Users
- `hasMany` Affectations

### `Article`
- `hasMany` LigneReceptions
- `hasMany` LigneDemandes
- `hasMany` Affectations

### `Fournisseur`
- `hasMany` Receptions

### `Reception`
- `belongsTo` Fournisseur
- `hasMany` LigneReceptions (via `lignes()`)

### `LigneReception`
- `belongsTo` Reception
- `belongsTo` Article

### `Demande`
- `belongsTo` User (via `utilisateur()`)
- `hasMany` LigneDemandes (via `lignes()`)

### `LigneDemande`
- `belongsTo` Demande
- `belongsTo` Article

### `Affectation`
- `belongsTo` Article
- `belongsTo` Service

---

## 7. Application Architecture

### Directory Structure

```
app/
  Http/
    Controllers/
      Api/                    # Sanctum-protected JSON API
        AuthController        # login, logout, me
        UserApiController     # CRUD users
        RoleApiController     # CRUD roles
        PermissionApiController # CRUD permissions
      Auth/
        LoginController       # Web session login
      UserController          # Web CRUD (Blade)
      RoleController          # Web CRUD (Blade)
      PermissionController    # Web CRUD (Blade)
    Middleware/
      CheckPermission.php     # permission:permission_name middleware
  Models/
    User, Service, Article, Fournisseur
    Reception, LigneReception
    Demande, LigneDemande
    Affectation
  Providers/
    AppServiceProvider

database/
  migrations/                 # All table definitions
  seeders/
    RolePermissionSeeder      # Seeds all roles and permissions
    AdminUserSeeder           # Creates default admin account
  factories/
    UserFactory

resources/views/
  auth/login.blade.php
  layouts/                    # Shared layouts
  users/                      # index, create, edit
  roles/                      # index, create, edit
  permissions/                # index, create, edit

routes/
  api.php                     # /api/* routes (Sanctum)
  web.php                     # Web routes (session)
```

---

## 8. Authentication

### Web (Session-based)
- Route: `POST /login` → `LoginController`
- Middleware: `auth`
- Used for Blade UI

### API (Token-based)
- Route: `POST /api/login` → `AuthController@login`
- Returns a Sanctum Bearer token
- All protected API routes use `auth:sanctum` middleware
- Token revocation: `POST /api/logout`

---

## 9. API Endpoints

Base URL: `http://localhost:8000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/login | No | Get Bearer token |
| POST | /api/logout | Yes | Revoke token |
| GET | /api/me | Yes | Current user with roles/permissions |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create user |
| GET | /api/users/{id} | Get user |
| PUT | /api/users/{id} | Update user |
| DELETE | /api/users/{id} | Delete user |

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/roles | List all roles |
| POST | /api/roles | Create role |
| GET | /api/roles/{id} | Get role |
| PUT | /api/roles/{id} | Update role |
| DELETE | /api/roles/{id} | Delete role |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/permissions | List all permissions |
| POST | /api/permissions | Create permission |
| GET | /api/permissions/{id} | Get permission |
| PUT | /api/permissions/{id} | Update permission |
| DELETE | /api/permissions/{id} | Delete permission |

> Note: API endpoints for Articles, Fournisseurs, Receptions, Demandes, and Affectations are not yet implemented — only the RBAC management layer is currently exposed via API.

---

## 10. Web Routes (Blade UI)

| Route | Controller | Description |
|-------|-----------|-------------|
| GET /login | LoginController | Login page |
| GET /users | UserController@index | User list |
| GET /users/create | UserController@create | Create user form |
| POST /users | UserController@store | Store user |
| GET /users/{id}/edit | UserController@edit | Edit user form |
| PUT /users/{id} | UserController@update | Update user |
| DELETE /users/{id} | UserController@destroy | Delete user |
| (same pattern) | RoleController | Role CRUD |
| (same pattern) | PermissionController | Permission CRUD |

---

## 11. Core Business Workflows

### Procurement Flow
1. A supplier (`Fournisseur`) delivers goods
2. A `Reception` is created with document type (Marché/Bon de Commande) and reference number
3. Each received item is recorded as a `LigneReception` (article + quantity)
4. `stock_actuel` on the `Article` is incremented accordingly

### Requisition Flow
1. A user (Chef/department head) creates a `Demande` with a scanned requisition slip (`bon_scanne`)
2. Each needed item is added as a `LigneDemande` (article + quantity + optional justification)
3. Demande status starts as `En_attente`
4. Magasinier reviews and sets status to `Valide`
5. Items are physically prepared and dispatched

### Assignment / Delivery Flow
1. An `Affectation` is created linking an `Article` to a `Service`
2. Includes quantity, target identifier (`cible`), optional GPS coordinates, and a proof photo
3. Demande status is updated to `Livre`
4. `stock_actuel` on the `Article` is decremented

### Low-Stock Alert
- Each `Article` has a `seuil_alerte` threshold
- When `stock_actuel <= seuil_alerte`, an alert should be triggered (notification to Admin/Magasinier)

---

## 12. Default Seed Data

### Admin Account
| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | password |
| Role | Admin |

### Seeded Roles
- `Admin` — all 11 permissions
- `Dept_Head` — submit_request, confirm_receipt, report_damage, view_own_dept
- `Overseer` — view_reports, view_own_dept

---

## 13. Development Commands

```bash
# Full setup
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
npm install && npm run build

# Dev server (run manually)
php artisan serve
npm run dev

# Testing
php artisan test
# or
composer test

# Code style
./vendor/bin/pint

# Full setup shortcut
composer setup
```

---

## 14. Current State & Gaps

### What's implemented
- Full RBAC system (roles, permissions, Spatie integration)
- User management (web + API)
- Role/Permission management (web + API)
- Session-based web auth + Sanctum API auth
- All database migrations for the full domain model
- Eloquent models with relationships for all entities

### What's NOT yet implemented (API/Controllers/Views)
- Articles CRUD (catalog management)
- Fournisseurs CRUD (supplier management)
- Receptions CRUD (procurement receipts)
- Demandes CRUD (requisition workflow)
- Affectations CRUD (assignment/delivery)
- Stock update logic (auto-increment/decrement on reception/affectation)
- Low-stock alert notifications
- File upload handling (bon_scanne, photo_jointe)
- Reporting / dashboard views
- QR code generation per asset

---

## 15. Key Design Decisions & Notes

- **Bilingual naming**: The codebase uses French domain terms (demande, fournisseur, affectation, etc.) reflecting the public-sector Algerian/Francophone context
- **Dual role system**: `User.role` string column coexists with Spatie roles — the string column appears to be a legacy/simplified reference; Spatie roles are the authoritative RBAC mechanism
- **bon_scanne is required**: Every demande must have a scanned physical requisition slip — this is a hard accountability requirement
- **Affectation as proof of delivery**: The `photo_jointe` and `coordonnees_gps` fields on affectations serve as the "digital handshake" — proof that items reached their destination
- **stock_actuel is derived**: It should be updated automatically when receptions are recorded (increment) and affectations are created (decrement) — this logic is not yet implemented
- **No soft deletes**: Cascade deletes are used throughout; data is hard-deleted

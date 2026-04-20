# PublicAsset OS — Project Overview

## What is this?

PublicAsset OS is a full-stack asset and consumable management system built for public offices. It tracks the complete lifecycle of physical assets (laptops, chairs, printers) and bulk consumables (paper, ink, cables) across departments — from procurement through assignment, receipt confirmation, and retirement.

The system enforces accountability at every step: stock only increases when a reception is recorded, stock only decreases when an affectation is created, and demandes follow a strict approval workflow before anything moves.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.3 / Laravel 13 |
| Database | MySQL |
| Auth | Laravel Sanctum (Bearer tokens) |
| RBAC | Spatie Laravel Permission |
| Frontend | React 19 + React Router v7 |
| Bundler | Vite |
| Styling | Plain CSS with CSS Modules |
| Icons | react-icons (Material Design) |
| HTTP Client | Axios |

---

## Roles & Permissions

Three roles exist in the system:

| Role | Who | What they can do |
|------|-----|-----------------|
| `Admin` | System administrator / warehouse manager | Full access to everything |
| `Dept_Head` | Department head / chef de service | Submit demandes, confirm receipt, report damage |
| `Overseer` | Auditor / inspector | View reports and stock data, no write access |

### Permission list

`manage_categories` `manage_items` `submit_request` `approve_request` `confirm_receipt` `manage_assets` `report_damage` `manage_consumables` `manage_assignments` `view_reports` `view_own_dept`

---
theHunter: Call of the Wild
## Core Workflow

```
Fournisseur → Réception → Stock increases
                              ↓
                         Demande (request)
                              ↓
                         Validation (approve_request)
                              ↓
                         Livraison (marked Livré)
                              ↓
                         Affectation → Stock decreases
```

1. **Réception** — A procurement receipt is created linking a supplier (fournisseur) to a document (Marché or Bon de Commande). Line items specify which articles were received and in what quantity. On save, each article's `stock_actuel` is automatically incremented.

2. **Demande** — A user submits a requisition listing the articles they need. Status starts at `En_attente`. An optional scanned slip (`bon_scanne`) can be attached.

3. **Validation** — A user with `approve_request` permission changes the demande status to `Valide`. The system enforces the transition: `En_attente → Valide → Livre`. No skipping.

4. **Affectation** — An admin creates an assignment record linking an article to a service. The system checks that sufficient stock exists before saving. On save, `stock_actuel` is decremented. On delete, stock is restored.

---

## Project Structure

```
AssetsMan/
├── backend/          Laravel API
└── frontend/         React SPA
```

---

## Backend

### Entry Points

| File | Purpose |
|------|---------|
| `backend/artisan` | Laravel CLI — run migrations, seeders, etc. |
| `backend/public/index.php` | HTTP entry point for all web requests |
| `backend/bootstrap/app.php` | Application bootstrap and middleware binding |
| `backend/routes/api.php` | All API route definitions |
| `backend/routes/web.php` | Web routes (login page for Blade UI) |

### Configuration

| File | Purpose |
|------|---------|
| `backend/.env` | Environment variables — DB credentials, app key, storage |
| `backend/config/auth.php` | Auth guards and providers |
| `backend/config/sanctum.php` | Sanctum token configuration |
| `backend/config/permission.php` | Spatie permission cache and model config |
| `backend/config/filesystems.php` | Storage disk configuration (local, public) |

### Models (`backend/app/Models/`)

| File | Table | Purpose |
|------|-------|---------|
| `User.php` | `users` | Authenticated user. Has roles via Spatie, has API tokens via Sanctum. Belongs to a Service. |
| `Service.php` | `services` | A department or organizational unit. Has many Users and Affectations. |
| `Article.php` | `articles` | A catalog item (Matériel or Fourniture). Tracks `stock_actuel` and `seuil_alerte`. Soft-deletable. |
| `Fournisseur.php` | `fournisseurs` | A supplier. Has many Receptions. Soft-deletable. |
| `Reception.php` | `receptions` | A procurement receipt. Belongs to a Fournisseur. Has many LigneReceptions. Soft-deletable. |
| `LigneReception.php` | `ligne_receptions` | One line of a reception: which article, how many received. |
| `Demande.php` | `demandes` | A requisition request. Belongs to a User. Has many LigneDemandes. Status: `En_attente / Valide / Livre`. Soft-deletable. |
| `LigneDemande.php` | `ligne_demandes` | One line of a demande: which article, how many requested, optional motif. |
| `Affectation.php` | `affectations` | An assignment of an article to a service. Tracks cible, GPS, photo proof, date. Soft-deletable. |

### API Controllers (`backend/app/Http/Controllers/Api/`)

| File | Routes | Purpose |
|------|--------|---------|
| `AuthController.php` | `POST /login` `POST /logout` `GET /me` | Handles Sanctum token issuance, revocation, and current user info. |
| `ArticleApiController.php` | `GET/POST /articles` `GET/PUT/DELETE /articles/{id}` | Full CRUD for the article catalog. Supports search and category filter. |
| `FournisseurApiController.php` | `GET/POST /fournisseurs` `GET/PUT/DELETE /fournisseurs/{id}` | Full CRUD for suppliers. |
| `ReceptionApiController.php` | `GET/POST /receptions` `GET/DELETE /receptions/{id}` | Creates procurement receipts with line items. On create, auto-increments `stock_actuel` for each article in a DB transaction. |
| `DemandeApiController.php` | `GET/POST /demandes` `GET/PUT/DELETE /demandes/{id}` | Manages requisitions. Dept_Head users only see their own. Enforces status transitions. Handles `bon_scanne` file upload via `FileUploadService`. |
| `AffectationApiController.php` | `GET/POST /affectations` `GET/DELETE /affectations/{id}` | Manages assignments. Checks stock sufficiency before saving. Auto-decrements stock on create, restores on delete. Handles `photo_jointe` upload. |
| `UserApiController.php` | `GET/POST /users` `GET/PUT/DELETE /users/{id}` | Full CRUD for users with role sync. |
| `RoleApiController.php` | `GET/POST /roles` `GET/PUT/DELETE /roles/{id}` | Full CRUD for roles with permission sync. |
| `PermissionApiController.php` | `GET/POST /permissions` `GET/PUT/DELETE /permissions/{id}` | Full CRUD for permissions. |
| `ServiceApiController.php` | `GET /services` | Read-only list of services for dropdowns. |

### Services (`backend/app/Services/`)

| File | Purpose |
|------|---------|
| `FileUploadService.php` | Validates and stores uploaded files. `storeBonScanne()` accepts PDF/JPG/PNG up to 5MB. `storePhotoJointe()` accepts JPG/PNG/WebP up to 5MB. Files are stored under `storage/app/public/bons/` and `storage/app/public/photos/` respectively. |

### Migrations (`backend/database/migrations/`)

| File | Creates |
|------|---------|
| `000000_create_services_table.php` | `services` table |
| `000000_create_users_table.php` | `users` table with `service_id`, `nom_complet`, `role` (display only) |
| `create_personal_access_tokens_table.php` | Sanctum tokens table |
| `create_permission_tables.php` | Spatie roles, permissions, model_has_roles, etc. |
| `create_fournisseurs_table.php` | `fournisseurs` table |
| `create_articles_table.php` | `articles` table with `stock_actuel`, `seuil_alerte`, `categorie` |
| `create_receptions_table.php` | `receptions` table with `type_doc`, `numero_doc`, `date_reception` |
| `create_ligne_receptions_table.php` | `ligne_receptions` pivot with `quantite_recue` |
| `create_demandes_table.php` | `demandes` table with `statut`, `bon_scanne` |
| `create_ligne_demandes_table.php` | `ligne_demandes` pivot with `quantite_demandee`, `motif` |
| `create_affectations_table.php` | `affectations` table with `cible`, `coordonnees_gps`, `photo_jointe`, `date_action` |
| `add_soft_deletes_to_*.php` | Adds `deleted_at` to articles, fournisseurs, receptions, demandes, affectations |

### Seeders (`backend/database/seeders/`)

| File | Seeds |
|------|-------|
| `DatabaseSeeder.php` | Orchestrates all seeders in the correct order |
| `RolePermissionSeeder.php` | Creates 3 roles (Admin, Dept_Head, Overseer) and 11 permissions |
| `AdminUserSeeder.php` | Creates `admin@example.com` / `password` with Admin role |
| `ServiceSeeder.php` | Creates 6 services: Direction Générale, RH, Informatique, Comptabilité, Logistique, Communication |
| `FournisseurSeeder.php` | Creates sample suppliers |
| `ArticleSeeder.php` | Creates sample articles with stock levels |
| `ReceptionSeeder.php` | Creates 3 sample receptions with line items |
| `DemandeSeeder.php` | Creates 3 sample demandes (En_attente, Valide, Livre) |
| `AffectationSeeder.php` | Creates 5 sample affectations across services |

---

## Frontend

### Entry Points

| File | Purpose |
|------|---------|
| `frontend/index.html` | HTML shell — mounts the React app at `#root` |
| `frontend/src/main.jsx` | React entry point — renders `<App>` inside `StrictMode` |
| `frontend/src/App.jsx` | Root component — wraps `RouterProvider` inside `AuthProvider` |
| `frontend/vite.config.js` | Vite config — proxies `/api` to `http://localhost:8000` in dev |

### Styles

| File | Purpose |
|------|---------|
| `frontend/src/styles/globals.css` | Global CSS variables (design tokens), resets, and base typography. All color, spacing, and radius values are defined here as CSS custom properties. |

### Context & Hooks

| File | Purpose |
|------|---------|
| `frontend/src/context/AuthContext.jsx` | React context that holds `user`, `token`, `login()`, `logout()`, `hasPermission()`, `hasRole()`. Persists token and user to `localStorage`. |
| `frontend/src/hooks/useAuth.js` | Convenience hook — returns the `AuthContext` value. Throws if used outside `AuthProvider`. |

### Router

| File | Purpose |
|------|---------|
| `frontend/src/router/index.jsx` | Defines all routes using `createBrowserRouter`. Contains `ProtectedRoute` (redirects to `/login` if no token) and `GuestRoute` (redirects to `/dashboard` if already logged in). Maps every URL to its page component. |

### API Modules (`frontend/src/api/`)

Each file is a thin wrapper around the Axios client. All requests automatically include the Bearer token via the interceptor in `client.js`.

| File | Endpoints wrapped |
|------|------------------|
| `client.js` | Axios instance with base URL `/api`, Bearer token interceptor, and 401 → redirect to `/login` handler |
| `auth.js` | `login()`, `logout()`, `me()` |
| `articles.js` | `getArticles()`, `getArticle()`, `createArticle()`, `updateArticle()`, `deleteArticle()` |
| `fournisseurs.js` | `getFournisseurs()`, `getFournisseur()`, `createFournisseur()`, `updateFournisseur()`, `deleteFournisseur()` |
| `receptions.js` | `getReceptions()`, `getReception()`, `createReception()`, `deleteReception()` |
| `demandes.js` | `getDemandes()`, `getDemande()`, `createDemande()`, `updateDemandeStatut()`, `deleteDemande()` |
| `affectations.js` | `getAffectations()`, `getAffectation()`, `createAffectation()`, `deleteAffectation()` |
| `users.js` | `getUsers()`, `getUser()`, `createUser()`, `updateUser()`, `deleteUser()` |
| `roles.js` | `getRoles()`, `getRole()`, `createRole()`, `updateRole()`, `deleteRole()` |
| `permissions.js` | `getPermissions()`, `createPermission()`, `updatePermission()`, `deletePermission()` |
| `services.js` | `getServices()` |

### Layout Components (`frontend/src/components/layout/`)

| File | Purpose |
|------|---------|
| `AppLayout.jsx` | Shell component rendered for all authenticated pages. Renders `<Sidebar>` + `<Header>` + `<Outlet>` (page content). Derives the page title from the current URL. |
| `AppLayout.module.css` | Fixed sidebar offset, main content flex layout, content padding. |
| `Sidebar.jsx` | Fixed left navigation panel. Reads user roles to show/hide nav sections. Each nav item has a react-icon. Active link gets a gold left border. Shows user avatar and name at the bottom. |
| `Sidebar.module.css` | Dark navy sidebar, section labels, link hover/active states, user info strip. |
| `Header.jsx` | Top bar showing the current page title and a logout button. |
| `Header.module.css` | Sticky white header with border, title and logout button styles. |

### UI Components (`frontend/src/components/ui/`)

| File | Purpose |
|------|---------|
| `Button.jsx` | Reusable button. Props: `variant` (primary, secondary, danger, ghost, accent), `size` (sm, md, lg). |
| `Button.module.css` | All button variant and size styles. |
| `Badge.jsx` | Inline status/category pill. Props: `variant` (success, warning, danger, info, accent, neutral, primary). |
| `Badge.module.css` | Color-coded badge styles. |
| `Modal.jsx` | Confirmation dialog overlay. Props: `title`, `message`, `onConfirm`, `onCancel`, `confirmLabel`, `danger`. Clicking the overlay cancels. |
| `Modal.module.css` | Centered modal with backdrop. |
| `Alert.jsx` | Dismissible flash message. Props: `type` (success, danger, warning), `message`, `onDismiss`. Auto-hides on dismiss click. |
| `Alert.module.css` | Color-coded alert bar with close button. |
| `Spinner.jsx` | Centered loading indicator. Props: `size` (px). |
| `Spinner.module.css` | CSS spinning animation. |
| `Pagination.jsx` | Page navigation from Laravel's paginator meta. Props: `meta` (current_page, last_page), `onPageChange`. Shows ellipsis for large page counts. |
| `Pagination.module.css` | Prev/next and numbered page button styles. |
| `FormField.jsx` | Form field wrapper. Exports `FormField` (label + error), `Input`, `Select`, `Textarea`. Handles error state styling automatically. |
| `FormField.module.css` | Field layout, input focus ring, error/hint text styles. |

### Pages (`frontend/src/pages/`)

#### Auth

| File | Purpose |
|------|---------|
| `auth/Login.jsx` | Full-screen login page. Submits email/password, stores token and user in context, redirects to `/dashboard`. Shows error on 401/422. |
| `auth/Login.module.css` | Centered card on dark navy background. |

#### Dashboard

| File | Purpose |
|------|---------|
| `dashboard/Dashboard.jsx` | Overview page. Loads articles, demandes, and receptions in parallel. Shows 4 stat cards (total articles, low stock count, pending demandes, receptions this month). Shows low-stock articles table and recent demandes table. |
| `dashboard/Dashboard.module.css` | Stat card grid, section titles, clickable table rows. |

#### Articles

| File | Purpose |
|------|---------|
| `articles/ArticleList.jsx` | Paginated table of all articles. Search by designation, filter by category. Red badge on low-stock rows. Permission-gated create/edit/delete actions. |
| `articles/ArticleForm.jsx` | Create and edit form. Fields: designation, categorie (select), stock_actuel, seuil_alerte. Handles 422 validation errors inline. |
| `articles/ArticleShow.jsx` | Detail view of a single article. Shows low-stock warning banner if applicable. Permission-gated edit button. |
| `articles/Articles.module.css` | Shared styles for all three article pages. |

#### Fournisseurs

| File | Purpose |
|------|---------|
| `fournisseurs/FournisseurList.jsx` | Paginated table of suppliers with delete confirmation. |
| `fournisseurs/FournisseurForm.jsx` | Create and edit form for raison_sociale and telephone. |
| `fournisseurs/Fournisseurs.module.css` | Shared styles. |

#### Réceptions

| File | Purpose |
|------|---------|
| `receptions/ReceptionList.jsx` | Paginated table of all receptions showing document number, type, supplier, date, and article count. |
| `receptions/ReceptionForm.jsx` | Create form with header fields (fournisseur, type_doc, numero_doc, date) and a dynamic line-item table. Lines can be added/removed. On submit, stock is auto-incremented server-side. |
| `receptions/ReceptionShow.jsx` | Detail view showing all header fields and the full list of received articles with quantities. |
| `receptions/Receptions.module.css` | Shared styles including the dynamic lignes table. |

#### Demandes

| File | Purpose |
|------|---------|
| `demandes/DemandeList.jsx` | Paginated table with status filter. Status badge per row. Dept_Head users only see their own demandes (filtered server-side). |
| `demandes/DemandeForm.jsx` | Create form with date, optional bon_scanne file upload, and dynamic line-item table (article + quantity + motif). Submits as `multipart/form-data`. |
| `demandes/DemandeShow.jsx` | Detail view with full line items. If user has `approve_request`: shows "Valider" button when status is `En_attente`, shows "Marquer comme livré" button with optional bon upload when status is `Valide`. |
| `demandes/Demandes.module.css` | Shared styles including file upload label and workflow action area. |

#### Affectations

| File | Purpose |
|------|---------|
| `affectations/AffectationList.jsx` | Paginated table filterable by service. Shows article, service, quantity, cible, and date. |
| `affectations/AffectationForm.jsx` | Create form. Selects article (shows current stock) and service. Shows stock warning if article is low. Fields for quantite, cible, GPS coordinates, date, and photo upload with live preview. Submits as `multipart/form-data`. |
| `affectations/AffectationShow.jsx` | Detail view. Shows all fields. GPS coordinates link to Google Maps. Photo is displayed as a full image. |
| `affectations/Affectations.module.css` | Shared styles including photo preview and GPS link. |

#### Users / Roles / Permissions

| File | Purpose |
|------|---------|
| `users/UserList.jsx` | Table of users with role badges. |
| `users/UserForm.jsx` | Create/edit user. Loads all roles for checkbox selection. Password optional on edit. |
| `users/Users.module.css` | Shared styles. |
| `roles/RoleList.jsx` | Table of roles with permission count badge. |
| `roles/RoleForm.jsx` | Create/edit role. Loads all permissions for checkbox grid. |
| `roles/Roles.module.css` | Shared styles including 2-column permission grid. |
| `permissions/PermissionList.jsx` | Simple table of all permissions. |
| `permissions/PermissionForm.jsx` | Single name field form. |
| `permissions/Permissions.module.css` | Shared styles. |

#### Utility Pages

| File | Purpose |
|------|---------|
| `ComingSoon.jsx` | Placeholder page for routes not yet implemented (Rapports). Shows a construction icon and a back button. |
| `ComingSoon.module.css` | Centered layout for the placeholder. |
| `ErrorPage.jsx` | React Router error boundary page. Shows a 404 icon for not-found routes, or a generic error icon for runtime errors. Replaces the default React Router error screen. |
| `ErrorPage.module.css` | Full-screen centered error layout. |

---

## Running the Project

### Prerequisites
- PHP 8.3, Composer
- Node.js 18+, npm
- MySQL running with a database named `laravel`

### First-time setup

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link

# Frontend
cd ../frontend
npm install
```

### Development

Run these in separate terminals:

```bash
# Terminal 1 — Laravel API
cd backend && php artisan serve
# Runs on http://localhost:8000

# Terminal 2 — React dev server
cd frontend && npm run dev
# Runs on http://localhost:5173
# /api requests are proxied to :8000 automatically
```

### Default login

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `password` |

---

## Key Design Decisions

**Stock is never manually edited.** It only changes through two controlled operations: reception (increment) and affectation (decrement). This creates a full audit trail.

**Status transitions are enforced server-side.** A demande cannot jump from `En_attente` to `Livre`. The backend rejects invalid transitions with a 422.

**File uploads go through a service.** `FileUploadService` validates MIME type and size before storing. Files are served from `public/storage/` via the symlink.

**Role checks are layered.** The sidebar hides links by role. Pages check `hasPermission()` before showing action buttons. The API enforces auth via Sanctum middleware on every protected route.

**Soft deletes preserve history.** Articles, fournisseurs, receptions, demandes, and affectations are soft-deleted — they remain in the database and can be restored if needed.

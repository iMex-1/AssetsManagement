# Frontend Tasks — PublicAsset OS

> Stack: React 19, React Router v7, Vite, plain CSS (custom design system)
> API: Laravel Sanctum — Bearer token stored in localStorage
> Base URL: `http://localhost:8000/api`

---

## Design System

### Color Palette
```
--primary:       #1B3A5C   (deep navy — authority, trust)
--primary-light: #2A5298   (medium blue — interactive)
--primary-dark:  #0F2340   (dark navy — sidebar bg)
--accent:        #C8922A   (warm gold — highlights, badges)
--accent-light:  #F0B429   (bright gold — hover states)
--danger:        #C0392B   (red — delete, low-stock)
--success:       #1A7A4A   (green — validated, delivered)
--warning:       #D97706   (amber — pending, alerts)
--neutral-50:    #F8F9FB
--neutral-100:   #EEF0F4
--neutral-200:   #D8DCE5
--neutral-500:   #6B7280
--neutral-700:   #374151
--neutral-900:   #111827
--white:         #FFFFFF
```

### Typography
- Font: `Inter` (Google Fonts)
- Base: 14px / 1.5
- Headings: 600 weight

### Component Tokens
- Border radius: 6px (cards), 4px (inputs/buttons)
- Sidebar width: 240px
- Header height: 56px
- Card shadow: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`

---

## Project Structure

```
src/
  api/
    client.js          # axios instance with auth interceptor
    auth.js
    articles.js
    fournisseurs.js
    users.js
    roles.js
    permissions.js
  components/
    layout/
      AppLayout.jsx    # sidebar + header shell
      Sidebar.jsx      # role-aware nav
      Header.jsx       # breadcrumb + user menu
    ui/
      Button.jsx
      Badge.jsx        # status / category badges
      Table.jsx        # reusable sortable table
      Modal.jsx        # confirm dialog
      Alert.jsx        # flash messages
      Spinner.jsx
      Pagination.jsx
      FormField.jsx    # label + input + error
  pages/
    auth/
      Login.jsx
    dashboard/
      Dashboard.jsx
    articles/
      ArticleList.jsx
      ArticleForm.jsx
      ArticleShow.jsx
    fournisseurs/
      FournisseurList.jsx
      FournisseurForm.jsx
    users/
      UserList.jsx
      UserForm.jsx
    roles/
      RoleList.jsx
      RoleForm.jsx
    permissions/
      PermissionList.jsx
      PermissionForm.jsx
  hooks/
    useAuth.js         # auth context + token management
    useApi.js          # generic fetch hook (loading/error/data)
  context/
    AuthContext.jsx
  router/
    index.jsx          # all routes + ProtectedRoute wrapper
  styles/
    globals.css        # design tokens + resets
    layout.css
    components.css
```

---

## Tasks

### TASK-01 — Project Setup
- [ ] Install dependencies: `react-router-dom`, `axios`
- [ ] Configure `vite.config.js` proxy → `http://localhost:8000`
- [ ] Create `src/styles/globals.css` with full design token system
- [ ] Set up `AuthContext` + `useAuth` hook (token in localStorage)
- [ ] Create `api/client.js` — axios instance with Bearer token interceptor
- [ ] Set up router with `ProtectedRoute` and role-based redirect

---

### TASK-02 — Layout Shell
**File:** `components/layout/AppLayout.jsx`

- [ ] Fixed sidebar (240px, `--primary-dark` bg) with logo at top
- [ ] Role-aware nav links with active state highlight (`--accent` left border)
- [ ] Top header bar: page title (breadcrumb) + user name + logout button
- [ ] Main content area with padding and `--neutral-50` background
- [ ] Responsive: sidebar collapses to icon-only on narrow screens

Nav sections by role:
```
Admin / Magasinier:
  - Tableau de bord
  - Catalogue > Articles, Fournisseurs
  - Réceptions
  - Demandes
  - Affectations
  - Administration > Utilisateurs, Rôles, Permissions

Chef (Dept_Head):
  - Tableau de bord
  - Mes Demandes
  - Affectations

Overseer:
  - Tableau de bord
  - Rapports
```

---

### TASK-03 — Login Page
**File:** `pages/auth/Login.jsx`

- [ ] Centered card on full-screen navy background
- [ ] Logo / app name at top of card
- [ ] Email + password fields with validation
- [ ] "Se connecter" button — loading state on submit
- [ ] Error message on invalid credentials (403/422)
- [ ] On success: store token + user in context, redirect to `/dashboard`

---

### TASK-04 — Dashboard
**File:** `pages/dashboard/Dashboard.jsx`

- [ ] Stat cards row (4 cards):
  - Total articles in catalog
  - Articles en stock bas (stock_actuel ≤ seuil_alerte) — red accent
  - Demandes en attente — amber accent
  - Réceptions ce mois
- [ ] Low-stock articles table (top 5, with gold warning badge)
- [ ] Recent demandes list (last 5, with status badge)
- [ ] Cards and data filtered by role (Chef sees only own service data)

---

### TASK-05 — Articles
**Files:** `pages/articles/ArticleList.jsx`, `ArticleForm.jsx`, `ArticleShow.jsx`

#### ArticleList
- [ ] Page header: title + "Nouvel article" button (permission: `manage_items`)
- [ ] Filter bar: search by designation, filter by catégorie (All / Matériel / Fourniture)
- [ ] Table columns: Désignation, Catégorie, Stock actuel, Seuil alerte, Actions
- [ ] Stock actuel cell: red badge if `stock_actuel <= seuil_alerte`
- [ ] Catégorie badge: navy for Matériel, gold for Fourniture
- [ ] Actions: Voir, Modifier (permission gated), Supprimer (confirm modal)
- [ ] Pagination

#### ArticleForm (create + edit)
- [ ] Fields: Désignation (text), Catégorie (select), Stock actuel (number), Seuil alerte (number)
- [ ] Inline validation errors
- [ ] Cancel → back to list

#### ArticleShow
- [ ] Detail card: all fields displayed
- [ ] Low-stock warning banner if applicable
- [ ] Edit button (permission gated)

---

### TASK-06 — Fournisseurs
**Files:** `pages/fournisseurs/FournisseurList.jsx`, `FournisseurForm.jsx`

#### FournisseurList
- [ ] Table: Raison sociale, Téléphone, Actions (Modifier, Supprimer)
- [ ] "Nouveau fournisseur" button
- [ ] Pagination

#### FournisseurForm (create + edit)
- [ ] Fields: Raison sociale (required), Téléphone (optional)
- [ ] Inline validation

---

### TASK-07 — Users
**Files:** `pages/users/UserList.jsx`, `UserForm.jsx`

#### UserList
- [ ] Table: Nom complet, Email, Service, Rôle(s) (badge per role), Actions
- [ ] "Nouvel utilisateur" button

#### UserForm (create + edit)
- [ ] Fields: Nom complet, Email, Password (+ confirm, optional on edit), Service (select), Roles (multi-checkbox)
- [ ] Inline validation

---

### TASK-08 — Roles
**Files:** `pages/roles/RoleList.jsx`, `RoleForm.jsx`

#### RoleList
- [ ] Table: Nom, Permissions (count badge), Actions

#### RoleForm
- [ ] Name field
- [ ] Permissions: checkbox grid (grouped or flat list of all 11 permissions)

---

### TASK-09 — Permissions
**Files:** `pages/permissions/PermissionList.jsx`, `PermissionForm.jsx`

#### PermissionList
- [ ] Simple table: Nom, Actions (Modifier, Supprimer)

#### PermissionForm
- [ ] Single name field

---

### TASK-10 — Shared UI Components
- [ ] `Button.jsx` — variants: primary, secondary, danger, ghost; sizes: sm, md
- [ ] `Badge.jsx` — variants: success, warning, danger, info, neutral
- [ ] `Table.jsx` — thead/tbody, empty state slot, loading skeleton rows
- [ ] `Modal.jsx` — confirm dialog with title, message, confirm/cancel buttons
- [ ] `Alert.jsx` — dismissible flash (success/error/warning)
- [ ] `Spinner.jsx` — centered loading indicator
- [ ] `Pagination.jsx` — prev/next + page numbers from Laravel meta
- [ ] `FormField.jsx` — label + input/select/textarea + error message

---

## Implementation Order

1. TASK-01 Setup + TASK-10 UI components
2. TASK-02 Layout shell
3. TASK-03 Login
4. TASK-04 Dashboard
5. TASK-05 Articles (most complex, sets the pattern)
6. TASK-06 Fournisseurs
7. TASK-07 Users
8. TASK-08 Roles
9. TASK-09 Permissions

---

## API Integration Notes

- All requests go through `api/client.js` (axios with `Authorization: Bearer {token}`)
- 401 response → clear token + redirect to `/login`
- 403 response → show "Accès refusé" toast
- 422 response → map `errors` object to form field errors
- Vite proxy handles CORS in dev: `/api` → `http://localhost:8000/api`

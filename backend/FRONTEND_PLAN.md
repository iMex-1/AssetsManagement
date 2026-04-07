# Frontend Plan — PublicAsset OS

> Stack: Blade + Vanilla JS/CSS, Vite bundling. No frontend framework.
> Auth: Session-based (web routes). API calls from Blade pages use fetch() with CSRF token.

---

## Page Inventory

### 1. Auth

| Page | Route | Access |
|------|-------|--------|
| Login | `GET /login` | Public |

**Login** — email + password form, redirects to dashboard on success.

---

### 2. Dashboard

| Page | Route | Access |
|------|-------|--------|
| Dashboard | `GET /dashboard` | All authenticated |

Role-aware summary cards:
- Admin/Magasinier: total articles, low-stock alerts count, pending demandes count, recent receptions
- Chef: my pending demandes, my service's affectations
- Overseer: stock overview, expenditure summary

---

### 3. Articles (Catalog)

| Page | Route | Access |
|------|-------|--------|
| List | `GET /articles` | All |
| Create | `GET /articles/create` | `manage_items` |
| Edit | `GET /articles/{id}/edit` | `manage_items` |
| Show | `GET /articles/{id}` | All |

**List** — table with columns: Désignation, Catégorie, Stock actuel, Seuil alerte, Actions.
- Filter by catégorie (Matériel / Fourniture)
- Visual badge when `stock_actuel <= seuil_alerte` (low-stock warning)
- Pagination

**Show** — article detail + stock history (receptions and affectations that touched this article)

---

### 4. Fournisseurs (Suppliers)

| Page | Route | Access |
|------|-------|--------|
| List | `GET /fournisseurs` | `manage_items` |
| Create | `GET /fournisseurs/create` | `manage_items` |
| Edit | `GET /fournisseurs/{id}/edit` | `manage_items` |

**List** — table: Raison sociale, Téléphone, Nb réceptions, Actions.

---

### 5. Réceptions (Procurement)

| Page | Route | Access |
|------|-------|--------|
| List | `GET /receptions` | `manage_items` |
| Create | `GET /receptions/create` | `manage_items` |
| Show | `GET /receptions/{id}` | `manage_items` |

**Create** — two-step form:
1. Header: select fournisseur, type_doc (Marché / Bon de Commande), numero_doc, date_reception
2. Line items: dynamic add/remove rows — article + quantite_recue
   - On save: stock_actuel on each article increments automatically

**Show** — receipt detail with all line items and supplier info.

---

### 6. Demandes (Requisitions)

| Page | Route | Access |
|------|-------|--------|
| List | `GET /demandes` | All (filtered by role) |
| Create | `GET /demandes/create` | `submit_request` |
| Show | `GET /demandes/{id}` | Owner or `approve_request` |
| Validate | `PATCH /demandes/{id}/valider` | `approve_request` |

**List:**
- Chef sees only their own demandes
- Admin/Magasinier sees all, filterable by statut (En_attente / Validé / Livré)
- Status badge per row

**Create:**
- Upload `bon_scanne` (required PDF/image)
- Dynamic line items: article + quantite_demandee + motif (optional)

**Show:**
- Full demande detail with line items
- If `approve_request`: action buttons — Valider / Rejeter
- Scanned slip preview/download link

---

### 7. Affectations (Assignments / Deliveries)

| Page | Route | Access |
|------|-------|--------|
| List | `GET /affectations` | `manage_assignments` or `view_own_dept` |
| Create | `GET /affectations/create` | `manage_assignments` |
| Show | `GET /affectations/{id}` | `manage_assignments` or `view_own_dept` |

**Create:**
- Select article, service, quantite_affectee
- cible (vehicle plate / office / pole number)
- coordonnees_gps (optional, for field installations)
- photo_jointe upload (proof of delivery)
- date_action

**Show:**
- Full delivery record with photo preview and GPS link (Google Maps)

---

### 8. Users

| Page | Route | Access |
|------|-------|--------|
| List | `GET /users` | Admin |
| Create | `GET /users/create` | Admin |
| Edit | `GET /users/{id}/edit` | Admin |

**List** — table: Nom complet, Email, Service, Rôle(s), Actions.

---

### 9. Roles & Permissions

| Page | Route | Access |
|------|-------|--------|
| Roles list | `GET /roles` | Admin |
| Role create/edit | `GET /roles/create`, `/roles/{id}/edit` | Admin |
| Permissions list | `GET /permissions` | Admin |
| Permission create/edit | `GET /permissions/create`, `/permissions/{id}/edit` | Admin |

**Role edit** — checkbox grid of all permissions to sync.

---

## Shared UI Components

| Component | Used on |
|-----------|---------|
| `layouts/app.blade.php` | All authenticated pages |
| Sidebar nav (role-aware links) | All authenticated pages |
| Flash alert (success/error) | All forms |
| Pagination links | All list pages |
| Status badge | Demandes list, Articles list |
| Dynamic line-item table (JS) | Réceptions create, Demandes create |
| File upload preview | Demandes create (bon_scanne), Affectations create (photo_jointe) |
| Low-stock alert banner | Dashboard, Articles list |

---

## Navigation Structure (by role)

```
Admin / Magasinier
├── Dashboard
├── Catalogue
│   ├── Articles
│   └── Fournisseurs
├── Réceptions
├── Demandes
├── Affectations
└── Administration
    ├── Utilisateurs
    ├── Rôles
    └── Permissions

Chef (Dept_Head)
├── Dashboard
├── Mes Demandes
└── Affectations (view own service)

Overseer
├── Dashboard
└── Rapports (view only)
```

---

## Key UX Notes

- Low-stock articles should be visually flagged everywhere they appear (red badge on stock count)
- `bon_scanne` upload on demande create must show a preview before submit
- Line-item tables (réceptions, demandes) need JS add/remove row without page reload
- Affectation `photo_jointe` should render as a thumbnail on the show page
- All destructive actions (delete, reject) need a confirmation dialog
- Forms should disable submit button on submit to prevent double-posting

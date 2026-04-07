# API Documentation — PublicAsset OS

> Base URL: `http://localhost:8000/api`
>
> All protected routes require `Authorization: Bearer {token}` header.
> Content-Type: `application/json`

---

## Authentication

### POST /api/login
Public. Returns a Sanctum Bearer token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response `200`:**
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "nom_complet": "Admin User",
    "email": "admin@example.com",
    "roles": ["Admin"]
  }
}
```

---

### POST /api/logout
Revokes the current token.

**Response `200`:**
```json
{ "message": "Logged out successfully." }
```

---

### GET /api/me
Returns the authenticated user with roles and permissions.

**Response `200`:**
```json
{
  "id": 1,
  "nom_complet": "Admin User",
  "email": "admin@example.com",
  "service_id": 2,
  "roles": ["Admin"],
  "permissions": ["manage_items", "approve_request", "..."]
}
```

---

## Articles (Item Catalog)

> Required permission: `manage_items` for write operations.

### GET /api/articles
List all articles (paginated).

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "designation": "Rampe LED 50W",
      "categorie": "Materiel",
      "stock_actuel": 42,
      "seuil_alerte": 10,
      "created_at": "2026-04-06T10:00:00Z",
      "updated_at": "2026-04-06T10:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 25, "total": 60 }
}
```

---

### POST /api/articles
Create a new article.

**Request:**
```json
{
  "designation": "Rampe LED 50W",
  "categorie": "Materiel",
  "stock_actuel": 0,
  "seuil_alerte": 10
}
```

| Field | Type | Rules |
|-------|------|-------|
| designation | string | required, max:255 |
| categorie | string | required, in:`Materiel`,`Fourniture` |
| stock_actuel | integer | required, min:0 |
| seuil_alerte | integer | required, min:0 |

**Response `201`:** Created article object.

---

### GET /api/articles/{id}
Get a single article.

**Response `200`:** Article object.

---

### PUT /api/articles/{id}
Update an article.

**Request:** Same fields as POST (all optional on update).

**Response `200`:** Updated article object.

---

### DELETE /api/articles/{id}
Soft-delete an article.

**Response `200`:**
```json
{ "message": "Article supprimé." }
```

---

## Fournisseurs (Suppliers)

> Required permission: `manage_items` for write operations.

### GET /api/fournisseurs
List all suppliers (paginated).

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "raison_sociale": "SARL ElecPro",
      "telephone": "0550123456",
      "created_at": "2026-04-06T10:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 25, "total": 5 }
}
```

---

### POST /api/fournisseurs
Create a supplier.

**Request:**
```json
{
  "raison_sociale": "SARL ElecPro",
  "telephone": "0550123456"
}
```

| Field | Type | Rules |
|-------|------|-------|
| raison_sociale | string | required, max:255 |
| telephone | string | nullable, max:20 |

**Response `201`:** Created supplier object.

---

### GET /api/fournisseurs/{id}
Get a single supplier.

---

### PUT /api/fournisseurs/{id}
Update a supplier.

---

### DELETE /api/fournisseurs/{id}
Soft-delete a supplier.

**Response `200`:**
```json
{ "message": "Fournisseur supprimé." }
```

---

## Users

> Required permission: Admin role for write operations.

### GET /api/users
List all users with their roles (paginated).

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "nom_complet": "Admin User",
      "email": "admin@example.com",
      "service_id": null,
      "roles": ["Admin"]
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 3 }
}
```

---

### POST /api/users
Create a user.

**Request:**
```json
{
  "nom_complet": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "password_confirmation": "secret123",
  "service_id": 2,
  "roles": [1]
}
```

| Field | Type | Rules |
|-------|------|-------|
| nom_complet | string | required, max:255 |
| email | string | required, email, unique |
| password | string | required, min:8, confirmed |
| service_id | integer | nullable, exists:services,id |
| roles | array | optional, array of role IDs |

**Response `201`:** Created user object with roles.

---

### GET /api/users/{id}
Get a single user with roles.

---

### PUT /api/users/{id}
Update a user. Password is optional on update.

**Request:**
```json
{
  "nom_complet": "Jane Doe",
  "email": "jane@example.com",
  "service_id": 3,
  "roles": [2]
}
```

---

### DELETE /api/users/{id}
Delete a user.

**Response `200`:**
```json
{ "message": "User deleted successfully." }
```

---

## Roles

> Admin only.

### GET /api/roles
List all roles with their permissions.

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "guard_name": "web",
      "permissions": ["manage_items", "approve_request", "..."]
    }
  ]
}
```

---

### POST /api/roles
Create a role.

**Request:**
```json
{
  "name": "Dept_Head",
  "permissions": [3, 5, 7]
}
```

| Field | Type | Rules |
|-------|------|-------|
| name | string | required, unique:roles, max:255 |
| permissions | array | optional, array of permission IDs |

**Response `201`:** Created role object.

---

### GET /api/roles/{id}
Get a single role with permissions.

---

### PUT /api/roles/{id}
Update a role and sync its permissions.

---

### DELETE /api/roles/{id}
Delete a role.

---

## Permissions

> Admin only.

### GET /api/permissions
List all permissions.

**Response `200`:**
```json
{
  "data": [
    { "id": 1, "name": "manage_categories", "guard_name": "web" },
    { "id": 2, "name": "manage_items", "guard_name": "web" }
  ]
}
```

---

### POST /api/permissions
Create a permission.

**Request:**
```json
{ "name": "manage_categories" }
```

---

### GET /api/permissions/{id}
Get a single permission.

---

### PUT /api/permissions/{id}
Update a permission name.

---

### DELETE /api/permissions/{id}
Delete a permission.

---

## RBAC Reference

### Roles & Permissions Matrix

| Permission | Admin | Dept_Head | Overseer |
|---|:---:|:---:|:---:|
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

## Error Responses

| Status | Meaning | Body |
|--------|---------|------|
| 401 | Unauthenticated | `{ "message": "Unauthenticated." }` |
| 403 | Forbidden / no permission | `{ "message": "Unauthorized" }` |
| 404 | Resource not found | `{ "message": "Not Found." }` |
| 422 | Validation failed | `{ "message": "...", "errors": { "field": ["..."] } }` |

---

## Implementation Status

| Resource | GET list | GET one | POST | PUT | DELETE |
|----------|:---:|:---:|:---:|:---:|:---:|
| Auth (login/logout/me) | — | ✓ | ✓ | — | — |
| Articles | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fournisseurs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Users | ✓ | ✓ | ✓ | ✓ | ✓ |
| Roles | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permissions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Receptions | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Demandes | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Affectations | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Services | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |

> ⏳ = routes registered, controllers not yet implemented

---

## Quick Test with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# List articles (replace TOKEN)
curl http://localhost:8000/api/articles \
  -H "Authorization: Bearer TOKEN"

# Create article
curl -X POST http://localhost:8000/api/articles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"designation":"Rampe LED 50W","categorie":"Materiel","stock_actuel":0,"seuil_alerte":10}'
```

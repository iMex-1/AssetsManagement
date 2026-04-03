# API Documentation — PublicAsset OS

## Base URL

```
http://localhost:8000/api
```

Authentication is handled via Laravel Sanctum. Include the token as a Bearer header on all protected routes.

---

## Authentication

### POST /api/login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": ["Admin"]
  }
}
```

### POST /api/logout

```http
POST /api/logout
Authorization: Bearer {token}
```

### GET /api/me

```http
GET /api/me
Authorization: Bearer {token}
```

---

## Users

All endpoints require `Authorization: Bearer {token}`.

| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | /api/users         | List all users    |
| POST   | /api/users         | Create a user     |
| GET    | /api/users/{id}    | Get a user        |
| PUT    | /api/users/{id}    | Update a user     |
| DELETE | /api/users/{id}    | Delete a user     |

Create/Update payload:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "roles": [1]
}
```

---

## Roles

| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | /api/roles         | List all roles    |
| POST   | /api/roles         | Create a role     |
| GET    | /api/roles/{id}    | Get a role        |
| PUT    | /api/roles/{id}    | Update a role     |
| DELETE | /api/roles/{id}    | Delete a role     |

Create/Update payload:
```json
{
  "name": "Dept_Head",
  "permissions": [2, 4, 6]
}
```

---

## Permissions

| Method | Endpoint                | Description            |
|--------|-------------------------|------------------------|
| GET    | /api/permissions        | List all permissions   |
| POST   | /api/permissions        | Create a permission    |
| GET    | /api/permissions/{id}   | Get a permission       |
| PUT    | /api/permissions/{id}   | Update a permission    |
| DELETE | /api/permissions/{id}   | Delete a permission    |

Create/Update payload:
```json
{
  "name": "manage_catalog"
}
```

---

## Default Permissions

| Permission          | Description                          |
|---------------------|--------------------------------------|
| manage_catalog      | Create/edit items and categories     |
| submit_request      | Submit a requisition request         |
| approve_request     | Approve or deny requests             |
| confirm_receipt     | Confirm delivery of an asset         |
| manage_assets       | Add/edit/retire assets               |
| report_damage       | Mark an asset as damaged             |
| manage_consumables  | Update consumable stock levels       |
| manage_assignments  | Assign assets to departments         |
| view_reports        | View global reports and dashboards   |
| view_own_dept       | View own department's data only      |

---

## Error Responses

```json
// 401 Unauthenticated
{ "message": "Unauthenticated." }

// 403 Forbidden
{ "message": "Unauthorized" }

// 422 Validation Error
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## Quick Test with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get users (replace TOKEN)
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer TOKEN"
```

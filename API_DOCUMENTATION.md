# RBAC API Documentation

## Overview
This Laravel application provides a complete Role-Based Access Control (RBAC) system with REST API endpoints.

## Features
- User management with role assignment
- Role management with permission assignment
- Permission management
- JWT-like token authentication using Laravel Sanctum
- Web interface for management
- RESTful API endpoints

## Installation

```bash
# Clone the repository
git clone https://github.com/iMex-1/AssetsManagement.git
cd AssetsManagement

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seed database
php artisan migrate
php artisan db:seed --class=RolePermissionSeeder

# Start the server
php artisan serve
```

## Default Roles & Permissions

### Permissions
- `create` - Create records
- `read` - Read records
- `update` - Update records
- `delete` - Delete records

### Roles
- **admin** - Has all permissions (create, read, update, delete)
- **editor** - Has create, read, and update permissions
- **viewer** - Has read permission only

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Authentication

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "permissions": [...]
      }
    ]
  }
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer {token}
```

### Users

#### List All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "roles": [1, 2]
}
```

#### Get User
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john@example.com",
  "password": "newpassword123",
  "roles": [1]
}
```

#### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

### Roles

#### List All Roles
```http
GET /api/roles
Authorization: Bearer {token}
```

#### Create Role
```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "manager",
  "description": "Manager role",
  "permissions": [1, 2, 3]
}
```

#### Get Role
```http
GET /api/roles/{id}
Authorization: Bearer {token}
```

#### Update Role
```http
PUT /api/roles/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "manager",
  "description": "Updated manager role",
  "permissions": [1, 2, 3, 4]
}
```

#### Delete Role
```http
DELETE /api/roles/{id}
Authorization: Bearer {token}
```

### Permissions

#### List All Permissions
```http
GET /api/permissions
Authorization: Bearer {token}
```

#### Create Permission
```http
POST /api/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "export",
  "description": "Export data"
}
```

#### Get Permission
```http
GET /api/permissions/{id}
Authorization: Bearer {token}
```

#### Update Permission
```http
PUT /api/permissions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "export",
  "description": "Export data to CSV"
}
```

#### Delete Permission
```http
DELETE /api/permissions/{id}
Authorization: Bearer {token}
```

## Web Interface

Access the web interface at:
- Users: `http://localhost:8000/users`
- Roles: `http://localhost:8000/roles`
- Permissions: `http://localhost:8000/permissions`

## Usage in Code

### Check if user has a role
```php
if ($user->hasRole('admin')) {
    // User is an admin
}
```

### Check if user has a permission
```php
if ($user->hasPermission('delete')) {
    // User can delete
}
```

### Using middleware to protect routes
```php
Route::middleware(['auth:sanctum', 'permission:delete'])->group(function () {
    Route::delete('/resource/{id}', [Controller::class, 'destroy']);
});
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Get Users (with token)
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## License
MIT

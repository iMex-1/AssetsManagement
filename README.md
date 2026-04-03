# PublicAsset OS

A high-accountability Asset & Consumable management system for public offices, built with Laravel 13. Tracks procurement, distribution, and the full lifecycle of assets and consumables across departments.

---

## Tech Stack

- PHP 8.3 / Laravel 13
- MySQL
- Laravel Sanctum (API auth)
- Spatie Laravel-Permission 7.2 (RBAC)
- Laravel Tinker, Pint, Pail

---

## Requirements

- PHP >= 8.3
- Composer
- MySQL
- Node.js & npm

---

## Setup

```bash
git clone <repo-url>
cd <project-folder>

composer install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` database credentials (see below), then:

```bash
php artisan migrate
php artisan db:seed
npm install && npm run build
php artisan serve
```

---

## Environment / Credentials

```env
APP_NAME=PublicAsset OS
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

### Default Admin Account

| Field    | Value               |
|----------|---------------------|
| Email    | admin@example.com   |
| Password | password            |
| Role     | Admin               |

---

## Roles & Permissions

| Role       | Permissions |
|------------|-------------|
| Admin      | All permissions |
| Dept_Head  | submit_request, confirm_receipt, report_damage, view_own_dept |
| Overseer   | view_reports, view_own_dept |

Full permission list: `manage_catalog`, `submit_request`, `approve_request`, `confirm_receipt`, `manage_assets`, `report_damage`, `manage_consumables`, `manage_assignments`, `view_reports`, `view_own_dept`

---

## API

Base URL: `http://localhost:8000/api`

Authentication uses Laravel Sanctum (Bearer token).

### Auth

| Method | Endpoint      | Auth | Description        |
|--------|---------------|------|--------------------|
| POST   | /api/login    | No   | Get access token   |
| POST   | /api/logout   | Yes  | Revoke token       |
| GET    | /api/me       | Yes  | Current user info  |

### Resources (all require auth)

| Resource    | Endpoints                          |
|-------------|------------------------------------|
| Users       | GET/POST /api/users, GET/PUT/DELETE /api/users/{id} |
| Roles       | GET/POST /api/roles, GET/PUT/DELETE /api/roles/{id} |
| Permissions | GET/POST /api/permissions, GET/PUT/DELETE /api/permissions/{id} |

See `API_DOCUMENTATION.md` for full request/response examples.

---

## Web Routes

| Route              | Description              |
|--------------------|--------------------------|
| GET /login         | Login page               |
| GET /users         | User management          |
| GET /roles         | Role management          |
| GET /permissions   | Permission management    |

---

## Database

See `DATABASE.md` for full table documentation and relationship diagrams.

---

## Project Structure

```
app/
  Http/
    Controllers/
      Api/          # Sanctum-protected API controllers
      Auth/         # Web login
    Middleware/     # CheckPermission
  Models/
database/
  migrations/       # All table definitions
  seeders/          # RolePermissionSeeder, AdminUserSeeder
routes/
  api.php           # API routes
  web.php           # Web routes
```

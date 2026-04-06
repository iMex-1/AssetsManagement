# Tech Stack

## Core
- PHP 8.3 / Laravel 13
- MySQL
- Blade templating (web UI)

## Key Packages
- `laravel/sanctum` ^4.3 — API token authentication
- `spatie/laravel-permission` ^7.2 — RBAC (roles & permissions)
- `laravel/tinker` — REPL for debugging
- `laravel/pint` — PHP code style fixer (PSR-12)
- `laravel/pail` — Log tailing
- `phpunit/phpunit` ^12.5 — Testing

## Frontend
- Vite for asset bundling
- Vanilla CSS/JS (no frontend framework currently)

## Common Commands

```bash
# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed

# Build frontend assets
npm run build       # production
npm run dev         # watch mode (run manually in terminal)

# Start dev server (run manually in terminal)
php artisan serve

# Run all dev processes together (run manually in terminal)
composer dev

# Testing
composer test
# or
php artisan test

# Code style
./vendor/bin/pint

# Full setup from scratch
composer setup
```

## Authentication
- Web: Session-based via `LoginController`, `auth` middleware
- API: Sanctum Bearer tokens, `auth:sanctum` middleware
- Permission checks: `CheckPermission` middleware or `$user->can('permission_name')`

# Project Structure

## Directory Layout

```
app/
  Http/
    Controllers/
      Api/          # Sanctum-protected API controllers (AuthController, UserApiController, etc.)
      Auth/         # Web session auth (LoginController)
    Middleware/
      CheckPermission.php   # Permission gate middleware, used as: middleware('permission:permission_name')
  Models/           # Eloquent models (Asset, Assignment, Category, Consumable, Department, Item, ItemRequest, User)
  Providers/

database/
  migrations/       # Timestamped migration files
  seeders/
    RolePermissionSeeder.php   # Defines all roles and permissions
    AdminUserSeeder.php        # Creates default admin account
  factories/

resources/
  views/
    auth/           # Login page
    layouts/        # Shared Blade layouts
    users/          # CRUD views for users
    roles/          # CRUD views for roles
    permissions/    # CRUD views for permissions

routes/
  api.php           # API routes (Sanctum-protected)
  web.php           # Web routes (session-protected)

config/
  permission.php    # Spatie permission config
  sanctum.php       # Sanctum config
```

## Conventions

### Models
- Use `$fillable` array or PHP 8 `#[Fillable]` attribute
- Use `$casts` / `casts()` method for type casting
- Define all relationships explicitly with return types (`BelongsTo`, `HasMany`, etc.)
- Foreign keys use `foreignId()->constrained()` pattern in migrations

### Controllers
- API controllers extend `App\Http\Controllers\Controller` and return `response()->json()`
- Web controllers use Blade views with `view('folder.file')` convention
- Use `apiResource()` for API routes, `resource()` for web routes
- Route names for API resources are explicitly namespaced: `api.resource.action`

### RBAC
- Roles: `Admin`, `Dept_Head`, `Overseer`
- Always use `guard_name: 'web'` when creating roles/permissions
- Use `firstOrCreate` in seeders to keep them idempotent
- Reset permission cache at the start of seeders: `app()[PermissionRegistrar::class]->forgetCachedPermissions()`

### Database
- All tables use `$table->id()` (auto-increment bigint)
- Soft deletes not currently used — use `onDelete('cascade')` on foreign keys where appropriate
- Nullable foreign keys use `onDelete('set null')`
- Asset status enum: `available`, `assigned`, `damaged`, `retired`
- Assignment status enum: `Pending_Acceptance`, `Accepted`

### API Responses
- Success: `response()->json([...])` with appropriate HTTP status
- Auth errors: 403 with `['message' => 'Unauthorized']`
- Validation errors: handled by Laravel's `ValidationException`

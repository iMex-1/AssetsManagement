git # Implementation Plan: PublicAsset OS

## Overview

Incremental implementation of the PublicAsset OS system on Laravel 11 + FilamentPHP + Livewire + Spatie Laravel-Permission. Each task builds on the previous, wiring all components together by the end.

## Tasks

- [x] 1. Fix database migrations and update Eloquent models
  - [x] 1.1 Update existing migrations to correct asset statuses (`Available`, `Assigned`, `In_Transit`, `Under_Repair`, `Disposed`) and request statuses (`Pending`, `Approved`, `Rejected`, `In_Transit`, `Delivered`)
    - Modify `2026_04_02_200003_create_assets_table.php` enum values
    - Modify `2026_04_02_200005_create_requests_table.php` enum values and add missing columns: `dept_id`, `justification`, `approved_by`, `approved_at`, `rejected_by`, `rejected_at`, `rejection_reason`, `dispatched_by`, `dispatched_at`
    - _Requirements: 3.4, 5.3, 5.4_
  - [x] 1.2 Update assignments migration to add missing columns: `request_id`, `returned_by`, `confirmed_at`, `status` (`Pending_Acceptance`, `Accepted`)
    - Add unique constraint on `asset_id` where `returned_at IS NULL` via a partial index
    - _Requirements: 6.1, 6.3, 5.5_
  - [x] 1.3 Add `dept_id` (nullable FK to departments) and `qr_code_path` columns to assets table via new migration
    - _Requirements: 3.7_
  - [x] 1.4 Update Eloquent models (`Asset`, `Consumable`, `Request`, `Assignment`, `Item`, `Category`, `Department`, `User`) with correct relationships, fillable fields, casts, and Spatie `HasRoles` trait on User
    - _Requirements: 1.2, 2.2, 3.1, 4.1, 5.1, 6.1_

- [ ] 2. Install and configure packages
  - [ ] 2.1 Install FilamentPHP (`filament/filament`), configure Admin panel at `/admin` restricted to `Admin` role, and configure a separate Overseer panel at `/overseer` restricted to `Overseer` role
    - _Requirements: 1.5, 1.7, 8.1_
  - [ ] 2.2 Install and configure `spatie/laravel-activitylog`, register `LogsActivity` on `Asset`, `Assignment`, `Request`, and `Consumable` models to capture before/after field values, acting user, and timestamp
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ] 2.3 Install `simplesoftwareio/simple-qrcode` and `maatwebsite/excel`; verify storage symlink exists for `storage/app/public/qrcodes/`
    - _Requirements: 3.6, 3.7, 8.4_

- [ ] 3. Implement RBAC middleware and authorization
  - [ ] 3.1 Replace the existing custom `CheckPermission` middleware with Spatie's `role` middleware; register `role`, `permission`, and `role_or_permission` aliases in `bootstrap/app.php`
    - _Requirements: 1.3, 1.4_
  - [ ] 3.2 Update `RolePermissionSeeder` to use Spatie's `Role::create` / `Permission::create` API for roles `Admin`, `Dept_Head`, `Overseer` and seed an admin user via `AdminUserSeeder`
    - _Requirements: 1.2_
  - [ ] 3.3 Add a custom 403 handler in the exception handler that redirects to a role-appropriate error page; create the error Blade view
    - _Requirements: 1.4_
  - [ ]* 3.4 Write feature tests for role-based route access (Admin, Dept_Head, Overseer each get 200 on permitted routes and 403 on forbidden routes)
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 4. Build Item Catalog FilamentPHP resources
  - [ ] 4.1 Create `CategoryResource` Filament resource with form fields (`name`, `type` select Asset/Consumable, `alert_threshold`) and table with filters; add `before_delete` hook to block deletion when items exist
    - _Requirements: 2.1, 2.6_
  - [ ] 4.2 Create `ItemResource` Filament resource with form fields (`model_name`, `brand`, `specifications`, `category_id`), required validation on `model_name`, `brand`, `category_id`; add `before_delete` hook to block deletion when assets, consumables, or requests exist
    - _Requirements: 2.2, 2.3, 2.7_
  - [ ]* 4.3 Write feature tests for Category and Item CRUD: create, update, delete-blocked-with-dependents
    - _Requirements: 2.1, 2.3, 2.6, 2.7_

- [ ] 5. Build Asset lifecycle FilamentPHP resource and QR code service
  - [ ] 5.1 Create `AssetResource` Filament resource with fields (`item_id`, `serial_number`, `internal_tag`, `status`, `purchase_date`, `purchase_cost`); enforce unique validation on `serial_number` and `internal_tag`; set default status `Available` on creation
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 5.2 Create `QrCodeService` class that accepts an Asset model, generates a QR PNG encoding `internal_tag`, `item_id`, `purchase_date`, `purchase_cost`, stores it to `storage/app/public/qrcodes/{internal_tag}.png`, and returns the relative path
    - _Requirements: 3.6, 3.7_
  - [ ] 5.3 Add a Filament table action "Generate QR Code" on `AssetResource` that calls `QrCodeService`, saves `qr_code_path` on the asset, and displays the QR image in a modal
    - _Requirements: 3.6, 3.7_
  - [ ]* 5.4 Write unit tests for `QrCodeService`: verify correct data is encoded, file is stored, and path is returned
    - _Requirements: 3.6, 3.7_
  - [ ]* 5.5 Write property test for Asset status uniqueness: for any set of assets, no two assets share the same `serial_number` or `internal_tag`
    - **Property 1: Uniqueness of asset identifiers**
    - **Validates: Requirements 3.2**

- [ ] 6. Build Consumable stock management resource
  - [ ] 6.1 Create `ConsumableResource` Filament resource with fields (`item_id`, `quantity`); add validation that `quantity` is a non-negative integer
    - _Requirements: 4.1, 4.2_
  - [ ] 6.2 Create a `ConsumableObserver` (or model event) that fires after `quantity` is updated: if `quantity <= category.alert_threshold`, dispatch a `LowStockNotification` to all Admin users via database and mail channels
    - _Requirements: 4.3, 4.4_
  - [ ]* 6.3 Write feature tests for low-stock notification: updating quantity to at/below threshold triggers notification to all admins; above threshold does not
    - _Requirements: 4.3, 4.4_

- [ ] 7. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement Requisition Request lifecycle
  - [ ] 8.1 Create `RequestForm` Livewire component for Dept_Head: fields `item_id`, `quantity`, `justification`, `dept_id` (auto-set to user's department); on submit set status `Pending`, record `user_id` and `created_at`
    - _Requirements: 5.1, 5.2_
  - [ ] 8.2 Create `RequestResource` Filament resource for Admin: list view with approve/reject/dispatch actions
    - Approve action: transitions status `Pending` → `Approved`, records `approved_by` and `approved_at`
    - Reject action: transitions status `Pending` → `Rejected`, records `rejected_by`, `rejected_at`, requires `rejection_reason`
    - Dispatch action: transitions status `Approved` → `In_Transit`; for Asset-type items creates an `Assignment` record with status `Pending_Acceptance`; checks consumable stock before approval (rejects with error if insufficient)
    - _Requirements: 5.3, 5.4, 5.5, 4.5_
  - [ ] 8.3 Create `DigitalHandshake` Livewire component for Dept_Head: lists assets in `Pending_Acceptance` for their department; on confirm, transitions Assignment status → `Accepted`, Asset status → `Assigned`, Request status → `Delivered`, records `confirmed_at`; denies if asset belongs to another department
    - _Requirements: 5.6, 5.7_
  - [ ] 8.4 Wire `RequestStatusNotification` (database + mail) to fire on every Request status change, sending to the requesting Dept_Head with new status and notes
    - _Requirements: 5.8_
  - [ ]* 8.5 Write feature tests for the full request lifecycle: submit → approve → dispatch → digital handshake → delivered; also test rejection flow and cross-department handshake denial
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - [ ]* 8.6 Write property test for Request status machine: status can only advance through valid transitions (Pending→Approved, Pending→Rejected, Approved→In_Transit, In_Transit→Delivered)
    - **Property 2: Request status transition validity**
    - **Validates: Requirements 5.3, 5.4, 5.5, 5.6**

- [ ] 9. Implement Department Assignment and audit trail
  - [ ] 9.1 Create `AssignmentResource` Filament resource for Admin/Overseer: filterable, paginated table of all assignments per asset and per department; add "Record Return" action that sets `returned_at`, `returned_by`, and resets Asset status to `Available`
    - _Requirements: 6.1, 6.2, 6.5_
  - [ ] 9.2 Add guard in Assignment creation (dispatch action) to reject if Asset status is not `Available`; add unique constraint enforcement to prevent simultaneous assignment of same asset
    - _Requirements: 6.3, 6.4_
  - [ ]* 9.3 Write feature tests for assignment guard: assigning a non-Available asset returns a validation error; returning an asset resets status to Available
    - _Requirements: 6.3, 6.4_
  - [ ]* 9.4 Write property test for single-assignment invariant: at any point, no asset has more than one Assignment record where `returned_at IS NULL`
    - **Property 3: Single active assignment per asset**
    - **Validates: Requirements 6.3**

- [ ] 10. Implement Damage Reporting
  - [ ] 10.1 Create `DamageReportForm` Livewire component for Dept_Head: lists assets assigned to their department; on submit sets Asset status to `Under_Repair` and dispatches `DamageReportNotification` to all Admins; denies if asset not assigned to user's department
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]* 10.2 Write feature tests for damage reporting: valid report sets status and sends notification; cross-department report is denied
    - _Requirements: 7.2, 7.4_

- [ ] 11. Build Overseer Dashboard widgets and export
  - [ ] 11.1 Create `ExpenditureWidget` Filament widget: query total `purchase_cost` grouped by Category and Department for a date-range filter; render as a table/chart in the Overseer panel
    - _Requirements: 8.1_
  - [ ] 11.2 Create `DepreciationService` that calculates straight-line depreciation (`(purchase_cost - salvage) / useful_life_years`) with a configurable useful life from app config; create `DepreciationWidget` that lists all assets with their calculated depreciation value
    - _Requirements: 8.2_
  - [ ] 11.3 Create `ConsumableUsageWidget`: query quantity changes from the activity log grouped by item per month to show consumption trends
    - _Requirements: 8.3_
  - [ ] 11.4 Create `WasteAuditWidget`: query Requests with status `Delivered` where the corresponding Asset status is still `Available` and `confirmed_at` is more than 30 days ago
    - _Requirements: 8.6_
  - [ ] 11.5 Create `ExportService` wrapping `maatwebsite/excel` to export Assignment history, Request history, and expenditure data to Excel and PDF; add export actions to Overseer panel accessible to Admin and Overseer roles
    - _Requirements: 8.4, 8.5_
  - [ ]* 11.6 Write unit tests for `DepreciationService`: verify straight-line calculation with known inputs
    - _Requirements: 8.2_
  - [ ]* 11.7 Write property test for depreciation non-negativity: for any asset with purchase_cost ≥ 0 and any elapsed time, calculated depreciation value is never negative
    - **Property 4: Depreciation non-negativity**
    - **Validates: Requirements 8.2**

- [ ] 12. Implement Notifications system
  - [ ] 12.1 Create notification classes: `RequestStatusNotification`, `LowStockNotification`, `DamageReportNotification`, `DigitalHandshakeNotification` — each implementing `toMail` and `toDatabase` channels; configure queue with 3 retries and exponential backoff (1s, 2s, 4s)
    - _Requirements: 9.1, 9.4, 9.5_
  - [ ] 12.2 Create `NotificationBell` Livewire component: displays unread count badge in nav header, polls or uses Livewire events to update; marks notification as read on click and decrements count
    - _Requirements: 9.2, 9.3_
  - [ ] 12.3 Wire all notification dispatch calls (already referenced in tasks 6.2, 8.4, 10.1) to use the notification classes created in 12.1; ensure failed mail jobs are logged to `failed_jobs` with recipient, event type, and timestamp
    - _Requirements: 9.1, 9.5_
  - [ ]* 12.4 Write feature tests for notification delivery: each event type triggers the correct notification to the correct recipients via both channels; failed mail is retried up to 3 times
    - _Requirements: 9.1, 9.4, 9.5_

- [ ] 13. Implement QR Code scanning interface
  - [ ] 13.1 Create `QrScanner` Livewire component: mobile-responsive layout (min 320px), integrates `html5-qrcode` JS library via `@script` directive, submits decoded value to server; server looks up asset by `internal_tag` and returns asset details (internal_tag, item name, brand, purchase date, purchase cost, status, assigned department, full assignment history) or an error message if not found
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ]* 13.2 Write feature tests for QR scanner lookup: valid internal_tag returns asset details; unrecognized code returns descriptive error
    - _Requirements: 10.2, 10.3_

- [ ] 14. Implement Audit Log resource
  - [ ] 14.1 Create `AuditLogResource` Filament resource (read-only, no create/edit/delete actions) for Admin panel: searchable and filterable by model type, record ID, acting user, and date range; display changed fields before/after values
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  - [ ]* 14.2 Write feature tests for audit log: create/update/delete on Asset, Assignment, Request, and Consumable each produce an activity log entry with correct fields; no user role can delete audit log entries
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 15. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Integration and final wiring
  - [ ] 16.1 Register all Livewire components in the appropriate Blade layouts (Dept_Head layout includes `NotificationBell`, `RequestForm`, `DigitalHandshake`, `DamageReportForm`, `QrScanner`); ensure routes are protected with correct Spatie role middleware
    - _Requirements: 1.3, 1.6, 9.2_
  - [ ] 16.2 Register all Filament resources in the Admin panel and Overseer panel providers; verify navigation groups and access policies are correctly scoped per role
    - _Requirements: 1.5, 1.7_
  - [ ] 16.3 Run `php artisan db:seed` to verify seeders create roles, permissions, and admin user correctly; confirm Spatie role middleware blocks cross-role access end-to-end
    - _Requirements: 1.2, 1.3_
  - [ ]* 16.4 Write end-to-end feature tests covering the full asset lifecycle: procurement → request → approval → dispatch → digital handshake → damage report → return → disposal, verifying audit log entries at each step
    - _Requirements: 3.5, 5.9, 6.1, 11.1_

- [ ] 17. Final checkpoint — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness invariants; unit/feature tests validate specific examples
- Checkpoints at tasks 7, 15, and 17 ensure incremental validation

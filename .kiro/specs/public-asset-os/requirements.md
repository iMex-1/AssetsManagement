# Requirements Document

## Introduction

PublicAsset OS is a high-accountability asset and consumable management system for public offices. It tracks the full lifecycle of government-owned assets (e.g., computers, chairs) and consumables (e.g., paper, ink) — from procurement and requisition through distribution, assignment, and disposal. The system enforces a "Digital Handshake" model where no asset is considered transferred until the recipient explicitly confirms receipt, creating a tamper-resistant audit trail. Built on Laravel 11 + Livewire with FilamentPHP for admin interfaces and Spatie Laravel-Permission for role-based access control.

## Glossary

- **System**: The PublicAsset OS application as a whole.
- **Admin**: A user with the `Admin` role who manages the catalog, approves requests, and reconciles stock.
- **Dept_Head**: A user with the `Dept_Head` role who submits requisition requests and confirms receipt of items.
- **Overseer**: A user with the `Overseer` role who monitors expenditure, depreciation, and audit reports.
- **Asset**: A uniquely identifiable physical item (e.g., laptop, chair) tracked by serial number and internal tag.
- **Consumable**: A bulk-stock item (e.g., paper, ink cartridges) tracked by quantity.
- **Item**: A catalog entry describing a product model (brand, specifications) that can be either an Asset or Consumable.
- **Category**: A classification grouping Items by type (Asset vs. Consumable) with an optional low-stock alert threshold.
- **Request**: A requisition submitted by a Dept_Head for one or more Items, progressing through a defined status lifecycle.
- **Assignment**: A record linking an Asset to a Department for a specific time period, forming the audit trail.
- **Department**: An organizational unit within the public office that can hold Assets and submit Requests.
- **Digital_Handshake**: The confirmation action performed by a Dept_Head to formally accept receipt of an assigned Asset.
- **QR_Code**: A machine-readable code uniquely identifying an Asset, encoding its lifecycle metadata.
- **Overseer_Dashboard**: The FilamentPHP dashboard panel visible to Overseer-role users showing expenditure and audit data.
- **Notification**: An in-app or email alert sent to relevant users upon system events.
- **Request_Status**: The lifecycle state of a Request: `Pending`, `Approved`, `Rejected`, `In_Transit`, `Delivered`.

---

## Requirements

### Requirement 1: User Authentication and Role-Based Access Control

**User Story:** As a system administrator, I want role-based access control enforced across all system functions, so that each user can only perform actions appropriate to their role.

#### Acceptance Criteria

1. THE System SHALL authenticate users via email and password before granting access to any protected route.
2. THE System SHALL assign each user exactly one of the following roles: `Admin`, `Dept_Head`, or `Overseer`.
3. WHEN an authenticated user attempts to access a resource, THE System SHALL verify the user's role before granting or denying access.
4. IF a user attempts to access a route not permitted by their role, THEN THE System SHALL return an HTTP 403 response and redirect to an appropriate error page.
5. WHERE the `Admin` role is assigned, THE System SHALL grant full access to catalog management, request approval, QR code generation, and stock reconciliation.
6. WHERE the `Dept_Head` role is assigned, THE System SHALL grant access to request submission, receipt confirmation, and damage reporting for the user's own department.
7. WHERE the `Overseer` role is assigned, THE System SHALL grant read-only access to the Overseer_Dashboard, expenditure reports, and audit logs.

---

### Requirement 2: Item Catalog Management

**User Story:** As an Admin, I want to manage a catalog of Items and Categories, so that all procurement and requisition activity references a controlled, consistent product list.

#### Acceptance Criteria

1. THE System SHALL provide a FilamentPHP CRUD interface for Categories with fields: `name`, `type` (Asset or Consumable), and `alert_threshold`.
2. THE System SHALL provide a FilamentPHP CRUD interface for Items with fields: `model_name`, `brand`, `specifications`, and a foreign key to `category_id`.
3. WHEN an Admin creates an Item, THE System SHALL require `model_name`, `brand`, and `category_id` as non-nullable fields.
4. WHEN an Admin sets `type` on a Category to `Asset`, THE System SHALL enforce that Items in that Category are tracked as individual Assets with serial numbers.
5. WHEN an Admin sets `type` on a Category to `Consumable`, THE System SHALL enforce that Items in that Category are tracked as Consumables with aggregate quantity.
6. IF an Admin attempts to delete a Category that has associated Items, THEN THE System SHALL prevent deletion and return a descriptive validation error.
7. IF an Admin attempts to delete an Item that has associated Assets, Consumables, or Requests, THEN THE System SHALL prevent deletion and return a descriptive validation error.

---

### Requirement 3: Asset Lifecycle Management

**User Story:** As an Admin, I want to register and track individual physical assets with unique identifiers, so that every unit can be audited from procurement to disposal.

#### Acceptance Criteria

1. THE System SHALL provide a FilamentPHP CRUD interface for Assets with fields: `item_id`, `serial_number`, `internal_tag`, `status`, and `purchase_date`, `purchase_cost`.
2. THE System SHALL enforce uniqueness of `serial_number` and `internal_tag` across all Asset records.
3. WHEN an Asset is created, THE System SHALL set its initial `status` to `Available`.
4. THE System SHALL track the following Asset statuses: `Available`, `Assigned`, `In_Transit`, `Under_Repair`, `Disposed`.
5. WHEN an Asset's `status` changes, THE System SHALL record the previous status, new status, timestamp, and acting user in an audit log entry.
6. WHEN an Admin requests QR code generation for an Asset, THE System SHALL generate a unique QR_Code encoding the Asset's `internal_tag`, `item_id`, `purchase_date`, and `purchase_cost`.
7. THE System SHALL store the generated QR_Code image and associate it with the Asset record.
8. WHEN a QR_Code is scanned, THE System SHALL display the Asset's current status, assigned department, purchase date, purchase cost, and full assignment history.

---

### Requirement 4: Consumable Stock Management

**User Story:** As an Admin, I want to track bulk consumable stock levels and receive alerts when stock is low, so that departments are never left without essential supplies.

#### Acceptance Criteria

1. THE System SHALL provide a FilamentPHP CRUD interface for Consumables with fields: `item_id` and `quantity`.
2. WHEN a Consumable's `quantity` is updated, THE System SHALL validate that the new quantity is a non-negative integer.
3. WHEN a Consumable's `quantity` falls at or below the `alert_threshold` defined on its parent Category, THE System SHALL send a Notification to all Admin users.
4. THE Notification SHALL include the Consumable's Item name, current quantity, and the Category's `alert_threshold` value.
5. IF a Request for a Consumable is approved and the requested quantity exceeds the current `quantity` in stock, THEN THE System SHALL reject the approval and return a descriptive error to the Admin.

---

### Requirement 5: Requisition Request Lifecycle

**User Story:** As a Dept_Head, I want to submit and track requisition requests for assets and consumables, so that my department's needs are formally recorded and fulfilled through an auditable process.

#### Acceptance Criteria

1. THE System SHALL provide a requisition form for Dept_Head users to submit Requests specifying `item_id`, `quantity`, `justification`, and target department.
2. WHEN a Dept_Head submits a Request, THE System SHALL set the Request's `status` to `Pending` and record the `user_id` and submission timestamp.
3. WHEN an Admin approves a Request, THE System SHALL transition the Request `status` from `Pending` to `Approved` and record the approving Admin's `user_id` and timestamp.
4. WHEN an Admin rejects a Request, THE System SHALL transition the Request `status` from `Pending` to `Rejected`, record the rejecting Admin's `user_id`, timestamp, and require a rejection reason.
5. WHEN an approved Request is dispatched, THE System SHALL transition the Request `status` to `In_Transit` and, for Asset-type Items, create an Assignment record with `status` set to `Pending_Acceptance`.
6. WHEN a Dept_Head performs the Digital_Handshake for an Asset, THE System SHALL transition the Assignment `status` to `Accepted`, set the Asset `status` to `Assigned`, transition the Request `status` to `Delivered`, and record the confirmation timestamp.
7. IF a Dept_Head attempts to perform the Digital_Handshake for an Asset not addressed to their department, THEN THE System SHALL deny the action and return a descriptive error.
8. WHEN a Request `status` changes, THE System SHALL send a Notification to the requesting Dept_Head with the new status and any relevant notes.
9. THE System SHALL display the full Request history with all status transitions, timestamps, and acting users to Admin users.

---

### Requirement 6: Department Assignment and Audit Trail

**User Story:** As an Admin, I want a complete audit trail of every asset assignment and return, so that accountability is maintained and no asset can "vanish" without a recorded action.

#### Acceptance Criteria

1. THE System SHALL create an Assignment record for every Asset dispatched to a Department, capturing `asset_id`, `dept_id`, `assigned_by`, `assigned_at`, and `request_id`.
2. WHEN an Asset is returned by a Department, THE System SHALL record `returned_at`, `returned_by`, and set the Asset `status` back to `Available`.
3. THE System SHALL prevent an Asset from being assigned to more than one Department simultaneously.
4. IF an Admin attempts to assign an Asset whose `status` is not `Available`, THEN THE System SHALL reject the assignment and return a descriptive error.
5. THE System SHALL provide a filterable, paginated Assignment history view accessible to Admin and Overseer users, showing all past and current assignments per Asset and per Department.

---

### Requirement 7: Damage Reporting

**User Story:** As a Dept_Head, I want to report damage to an assigned asset, so that the Admin is notified and the asset's status is updated to reflect its condition.

#### Acceptance Criteria

1. THE System SHALL provide a damage report form for Dept_Head users to report damage on Assets currently assigned to their department.
2. WHEN a Dept_Head submits a damage report, THE System SHALL set the Asset `status` to `Under_Repair` and send a Notification to all Admin users.
3. THE Notification SHALL include the Asset's `internal_tag`, Item name, reporting Dept_Head's name, department, and the damage description.
4. IF a Dept_Head attempts to submit a damage report for an Asset not assigned to their department, THEN THE System SHALL deny the action and return a descriptive error.

---

### Requirement 8: Overseer Dashboard and Reporting

**User Story:** As an Overseer, I want a real-time dashboard showing expenditure, asset depreciation, and usage patterns, so that I can audit waste and ensure public funds are used responsibly.

#### Acceptance Criteria

1. THE Overseer_Dashboard SHALL display total procurement expenditure grouped by Category and by Department for a selectable date range.
2. THE Overseer_Dashboard SHALL display a list of all Assets with their calculated depreciation value, using straight-line depreciation over a configurable useful life period.
3. THE Overseer_Dashboard SHALL display consumable usage trends showing quantity consumed per Item per month.
4. THE System SHALL provide an export function allowing Overseer and Admin users to export Assignment history, Request history, and expenditure reports to Excel and PDF formats.
5. WHEN an export is requested, THE System SHALL generate the file and make it available for download within 30 seconds for datasets up to 10,000 records.
6. THE Overseer_Dashboard SHALL display a "waste vs. usage" audit view listing Requests that were approved but where the corresponding Asset has remained in `Available` status for more than 30 days after delivery.

---

### Requirement 9: Notifications

**User Story:** As a system user, I want to receive timely in-app and email notifications for events relevant to my role, so that I can act on pending tasks without manually polling the system.

#### Acceptance Criteria

1. THE System SHALL deliver Notifications via both in-app (database-stored) and email channels for all notification events.
2. WHEN a Notification is delivered in-app, THE System SHALL display an unread count badge in the navigation header for the recipient user.
3. WHEN a user reads an in-app Notification, THE System SHALL mark it as read and decrement the unread count.
4. THE System SHALL send Notifications for the following events: Request status changes, low-stock alerts, damage reports, and Digital_Handshake confirmations.
5. IF an email Notification fails to deliver, THEN THE System SHALL log the failure with the recipient, event type, and timestamp, and retry delivery up to 3 times with exponential backoff.

---

### Requirement 10: QR Code Scanning and Asset Lookup

**User Story:** As any authenticated user, I want to scan an asset's QR code to instantly retrieve its full lifecycle information, so that physical audits can be performed without accessing a desktop terminal.

#### Acceptance Criteria

1. THE System SHALL provide a mobile-responsive QR code scanning interface accessible to all authenticated users.
2. WHEN a valid QR_Code is scanned, THE System SHALL display the Asset's `internal_tag`, Item name, brand, purchase date, purchase cost, current status, current assigned department, and full assignment history within 3 seconds.
3. IF a scanned QR_Code does not match any Asset in the System, THEN THE System SHALL display a descriptive error message indicating the code is unrecognized.
4. THE System SHALL render the QR scanning interface correctly on screens with a minimum width of 320px.

---

### Requirement 11: Data Integrity and Audit Logging

**User Story:** As an Admin, I want all critical state changes to be logged immutably, so that the system can withstand audits and no record can be silently altered.

#### Acceptance Criteria

1. THE System SHALL record an audit log entry for every create, update, and delete operation on Assets, Assignments, Requests, and Consumable quantities.
2. EACH audit log entry SHALL capture: the affected model type, record ID, changed fields (before and after values), acting user ID, and timestamp.
3. THE System SHALL prevent deletion of audit log entries by any user role, including Admin.
4. THE System SHALL provide a searchable audit log view accessible to Admin users, filterable by model type, record ID, acting user, and date range.

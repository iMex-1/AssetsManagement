# Database Documentation

## Overview

PublicAsset OS uses MySQL with 12 application tables plus Laravel framework tables. The schema is organized around a catalog of items that can be either tracked as individual assets or managed as bulk consumables.

---

## Entity Relationship Summary

```
categories
    └── items
            ├── assets
            │       └── assignments ──── departments
            │                      └─── users
            ├── consumables
            └── requests ──────────── users
```

---

## Application Tables

### categories

Defines the type of item — either a trackable Asset or a bulk Consumable.

| Column          | Type                      | Notes                        |
|-----------------|---------------------------|------------------------------|
| id              | bigint (PK)               |                              |
| name            | varchar(255)              | unique                       |
| type            | enum('Asset','Consumable')| determines tracking method   |
| alert_threshold | int unsigned              | triggers low-stock alert     |
| created_at      | timestamp                 |                              |
| updated_at      | timestamp                 |                              |

---

### items

The global catalog of orderable/trackable products.

| Column         | Type        | Notes                        |
|----------------|-------------|------------------------------|
| id             | bigint (PK) |                              |
| category_id    | bigint (FK) | → categories.id (cascade)    |
| model_name     | varchar(255)|                              |
| brand          | varchar(255)| nullable                     |
| specifications | text        | nullable                     |
| created_at     | timestamp   |                              |
| updated_at     | timestamp   |                              |

Relations: belongs to `categories`, has many `assets`, has many `consumables`, has many `requests`

---

### assets

Individual physical units of an item (e.g. a specific laptop with a serial number).

| Column        | Type                                          | Notes                     |
|---------------|-----------------------------------------------|---------------------------|
| id            | bigint (PK)                                   |                           |
| item_id       | bigint (FK)                                   | → items.id (cascade)      |
| serial_number | varchar(255)                                  | unique, nullable          |
| internal_tag  | varchar(255)                                  | unique, nullable          |
| status        | enum('available','assigned','damaged','retired') | default: available     |
| qr_code_path  | varchar(255)                                  | nullable                  |
| created_at    | timestamp                                     |                           |
| updated_at    | timestamp                                     |                           |

Relations: belongs to `items`, has many `assignments`

---

### consumables

Tracks bulk stock quantity for consumable items (e.g. paper, ink cartridges).

| Column     | Type        | Notes                     |
|------------|-------------|---------------------------|
| id         | bigint (PK) |                           |
| item_id    | bigint (FK) | → items.id (cascade)      |
| quantity   | int unsigned| default: 0                |
| created_at | timestamp   |                           |
| updated_at | timestamp   |                           |

Relations: belongs to `items`

---

### departments

Organizational units that receive assets.

| Column     | Type        | Notes  |
|------------|-------------|--------|
| id         | bigint (PK) |        |
| name       | varchar(255)| unique |
| created_at | timestamp   |        |
| updated_at | timestamp   |        |

Relations: has many `assignments`

---

### requests

The requisition lifecycle — a user requests an item, admin approves/denies, then it gets delivered.

| Column     | Type                                        | Notes                  |
|------------|---------------------------------------------|------------------------|
| id         | bigint (PK)                                 |                        |
| user_id    | bigint (FK)                                 | → users.id (cascade)   |
| item_id    | bigint (FK)                                 | → items.id (cascade)   |
| quantity   | int unsigned                                | default: 1             |
| status     | enum('pending','approved','denied','delivered') | default: pending   |
| notes      | text                                        | nullable               |
| created_at | timestamp                                   |                        |
| updated_at | timestamp                                   |                        |

Status flow: `pending` → `approved` / `denied` → `delivered`

Relations: belongs to `users`, belongs to `items`

---

### assignments

Audit trail of which asset was assigned to which department, by whom, and when.

| Column           | Type        | Notes                          |
|------------------|-------------|--------------------------------|
| id               | bigint (PK) |                                |
| asset_id         | bigint (FK) | → assets.id (cascade)          |
| dept_id          | bigint (FK) | → departments.id (cascade)     |
| assigned_by      | bigint (FK) | → users.id (cascade)           |
| receipt_confirmed| tinyint(1)  | default: 0 (digital handshake) |
| assigned_at      | timestamp   | default: current_timestamp     |
| returned_at      | timestamp   | nullable                       |
| created_at       | timestamp   |                                |
| updated_at       | timestamp   |                                |

Relations: belongs to `assets`, belongs to `departments`, belongs to `users` (assigned_by)

---

### users

Core user accounts.

| Column            | Type         | Notes  |
|-------------------|--------------|--------|
| id                | bigint (PK)  |        |
| name              | varchar(255) |        |
| email             | varchar(255) | unique |
| email_verified_at | timestamp    | nullable |
| password          | varchar(255) |        |
| remember_token    | varchar(100) | nullable |
| created_at        | timestamp    |        |
| updated_at        | timestamp    |        |

Relations: has many `requests`, has many `assignments` (as assigned_by), has roles via `model_has_roles`

---

## RBAC Tables (Spatie Laravel-Permission)

### permissions

| Column     | Type        | Notes                    |
|------------|-------------|--------------------------|
| id         | bigint (PK) |                          |
| name       | varchar(255)| unique per guard_name    |
| guard_name | varchar(255)|                          |
| created_at | timestamp   |                          |
| updated_at | timestamp   |                          |

### roles

| Column     | Type        | Notes                    |
|------------|-------------|--------------------------|
| id         | bigint (PK) |                          |
| name       | varchar(255)| unique per guard_name    |
| guard_name | varchar(255)|                          |
| created_at | timestamp   |                          |
| updated_at | timestamp   |                          |

### role_has_permissions

Pivot table linking roles to permissions.

| Column        | Type        |
|---------------|-------------|
| permission_id | bigint (FK) → permissions.id |
| role_id       | bigint (FK) → roles.id       |

### model_has_roles

Assigns roles to any model (polymorphic — used for users).

| Column     | Type        |
|------------|-------------|
| role_id    | bigint (FK) → roles.id |
| model_type | varchar(255)|
| model_id   | bigint      |

### model_has_permissions

Assigns permissions directly to any model (polymorphic).

| Column        | Type        |
|---------------|-------------|
| permission_id | bigint (FK) → permissions.id |
| model_type    | varchar(255)|
| model_id      | bigint      |

---

## Laravel Framework Tables

| Table                  | Purpose                              |
|------------------------|--------------------------------------|
| sessions               | Database session storage             |
| cache / cache_locks    | Database cache driver                |
| jobs / job_batches     | Queue job storage                    |
| failed_jobs            | Failed queue job log                 |
| personal_access_tokens | Sanctum API tokens                   |
| password_reset_tokens  | Password reset flow                  |
| migrations             | Migration run history                |

---

## Key Relationships at a Glance

| From         | To           | Type       | Via              |
|--------------|--------------|------------|------------------|
| categories   | items        | one-to-many| items.category_id |
| items        | assets       | one-to-many| assets.item_id   |
| items        | consumables  | one-to-many| consumables.item_id |
| items        | requests     | one-to-many| requests.item_id |
| assets       | assignments  | one-to-many| assignments.asset_id |
| departments  | assignments  | one-to-many| assignments.dept_id |
| users        | requests     | one-to-many| requests.user_id |
| users        | assignments  | one-to-many| assignments.assigned_by |
| users        | roles        | many-to-many | model_has_roles |
| roles        | permissions  | many-to-many | role_has_permissions |

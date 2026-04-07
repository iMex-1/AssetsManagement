# Project: PublicAsset OS (Laravel-Based)

**Objective:** A high-accountability Asset & Consumable management system for public offices to track procurement, distribution, and lifecycle.

---

## 1. Core Architecture (The Dev A Pillar)

- **Framework:** Laravel 11 + Livewire.
    
- **Admin/Overseer UI:** **FilamentPHP** (Fastest CRUD/Dashboard generation).
    
- **Permissions:** Spatie Laravel-Permission (Roles: `Admin`, `Dept_Head`, `Overseer`).
    
- **Asset Tracking:** Unique QR Code generation via `simplesoftwareio/simple-qrcode`.
    

---

## 2. Refined Database Schema

|**Table**|**Key Fields**|**Purpose**|
|---|---|---|
|**Categories**|`name`, `type` (Asset vs Consumable), `alert_threshold`|Distinguishes bulk paper from unique laptops.|
|**Items**|`model_name`, `brand`, `specifications`|The global "Catalog" of what can be ordered.|
|**Assets**|`item_id`, `serial_number`, `internal_tag`, `status`|Individual physical units (Chairs, PCs).|
|**Consumables**|`item_id`, `quantity`|Bulk stock tracking (Ink, Paper).|
|**Requests**|`user_id`, `item_id`, `quantity`, `status`|The requisition lifecycle (Pending -> Delivered).|
|**Assignments**|`asset_id`, `dept_id`, `assigned_at`, `returned_at`|The audit trail of who has what.|

---

## 3. The Use Case Ecosystem

- **Admin:** Manage catalog, approve/deny requests, generate QR codes, reconcile physical stock.
    
- **Department Head:** Submit requests, **Confirm Receipt** (Digital Handshake), report damage.
    
- **Overseer:** View global expenditure, track asset depreciation, audit "waste" vs "usage."
    

---

## 4. 30-Day Development Sprint (Team of 4)

### **Week 1: Foundations (The Skeleton)**

- **Dev A (Architect):** Lock Migrations, install Filament & Spatie, setup Auth.
    
- **Dev B (Backend):** Create CRUDs for Items/Categories.
    
- **Dev C (Frontend):** Base Dashboard layout and "My Dept" view.
    
- **Dev D (DevOps):** Git Repo, Docker/Sail environment, Seed data.
    

### **Week 2: Workflow (The Circulation)**

- **Dev A:** Build the Requisition Logic (`Pending` -> `Approved`).
    
- **Dev B:** Implement QR Code generation for Assets.
    
- **Dev C:** Build the Requisition Form for Dept Heads.
    
- **Dev D:** Unit testing the "Request" flow.
    

### **Week 3: Accountability (The Handshake)**

- **Dev A:** Transfer/Receipt logic (The "I got it" button).
    
- **Dev B:** Overseer Dashboard with Charts/Widgets.
    
- **Dev C:** System Notifications (In-app/Email).
    
- **Dev D:** Role-based security testing.
    

### **Week 4: Final Polish (The Deployment)**

- **Team:** Export to Excel/PDF for reports, mobile-responsive UI for QR scanning, final deployment to Linux server.
    

---

## 5. Strategic "Killer Features"

1. **The Digital Handshake:** No asset is "assigned" until the recipient clicks **Accept**. This stops items from "vanishing" during transit.
    
2. **QR Lifecycle:** Scan any item in the building to instantly see its purchase date, cost, and owner.
    
3. **Low-Stock Alerts:** Automated notifications to the Admin when paper or ink hits the `alert_threshold`.
    

---

## 6. Development Rules (The "Mentor" Stress-Test)

- **No Perfectionism:** Use Filament for the Admin/Overseer. Don't waste time on custom CSS for internal tools.
    
- **Schema Freeze:** No one touches migrations after Week 1 without a team meeting.
    
- **Identity Sync:** Use Laravel Sail/Docker to ensure the Linux dev environments are identical across all 4 machines.
    
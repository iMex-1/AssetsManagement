# PublicAsset OS — Product Overview

PublicAsset OS is a high-accountability asset and consumable management system for public offices. It tracks the full lifecycle of physical assets (e.g., laptops, chairs) and bulk consumables (e.g., paper, ink) across departments — from procurement and requisition through assignment, receipt confirmation, and retirement.

## Core Roles

| Role | Responsibilities |
|------|-----------------|
| Admin | Full access: manage catalog, approve requests, manage assets/consumables, generate QR codes |
| Dept_Head | Submit requests, confirm receipt (digital handshake), report damage |
| Overseer | View reports, audit expenditure and asset depreciation |

## Key Permissions

`manage_categories`, `manage_items`, `submit_request`, `approve_request`, `confirm_receipt`, `manage_assets`, `report_damage`, `manage_consumables`, `manage_assignments`, `view_reports`, `view_own_dept`

## Killer Features

- **Digital Handshake**: Assets are not considered assigned until the recipient explicitly confirms receipt
- **QR Lifecycle**: Each asset gets a QR code linking to its full history (purchase date, cost, owner)
- **Low-Stock Alerts**: Automated notifications when consumables hit `alert_threshold`

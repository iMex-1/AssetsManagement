# PublicAsset OS — Product Overview

PublicAsset OS is a high-accountability asset and consumable management system for public offices. It tracks the full lifecycle of physical assets (e.g., laptops, chairs) and bulk consumables (e.g., paper, ink) across departments — from procurement and requisition through assignment, receipt confirmation, and retirement.

## Core Roles

| Role | Responsibilities |
|------|-----------------|
| Admin | Full access: manage catalog, approve requests, manage assets/consumables, generate QR codes |
| Chef_Service | Submit requests, confirm receipt, signal breakdowns, view own service |
| Directeur | View reports, audit expenditure and asset depreciation, global inventory overview |

## Key Permissions

`gerer_articles`, `soumettre_demande`, `approuver_demande`, `confirmer_reception`, `signaler_panne`, `gerer_affectations`, `voir_rapports`, `voir_son_service`

## Killer Features

- **Digital Handshake**: Assets are not considered assigned until the recipient explicitly confirms receipt
- **QR Lifecycle**: Each asset gets a QR code linking to its full history (purchase date, cost, owner)
- **Low-Stock Alerts**: Automated notifications when consumables hit `alert_threshold`

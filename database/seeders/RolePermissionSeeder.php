<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permissions scoped to the PublicAsset OS domain
        $permissions = [
            // Catalog / Items
            ['name' => 'manage_catalog',       'description' => 'Create, edit, delete items and categories'],
            // Requests
            ['name' => 'submit_request',       'description' => 'Submit a requisition request'],
            ['name' => 'approve_request',      'description' => 'Approve or deny requisition requests'],
            ['name' => 'confirm_receipt',      'description' => 'Confirm receipt of an asset (Digital Handshake)'],
            // Assets
            ['name' => 'manage_assets',        'description' => 'Register, tag, and generate QR codes for assets'],
            ['name' => 'report_damage',        'description' => 'Report a damaged or lost asset'],
            // Consumables
            ['name' => 'manage_consumables',   'description' => 'Adjust consumable stock levels'],
            // Assignments
            ['name' => 'manage_assignments',   'description' => 'Assign and return assets to departments'],
            // Reporting / Oversight
            ['name' => 'view_reports',         'description' => 'View expenditure, depreciation, and audit reports'],
            ['name' => 'view_own_dept',        'description' => 'View assets and requests for own department only'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->insertOrIgnore(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Roles from project-outline-2.md
        $roles = [
            ['name' => 'Admin',     'description' => 'Full system access: catalog, approvals, QR codes, stock reconciliation'],
            ['name' => 'Dept_Head', 'description' => 'Submit requests, confirm receipt, report damage'],
            ['name' => 'Overseer',  'description' => 'Read-only global view: expenditure, depreciation, audit trail'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->insertOrIgnore(array_merge($role, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Fetch IDs by name so order doesn't matter
        $perm = DB::table('permissions')->pluck('id', 'name');
        $role = DB::table('roles')->pluck('id', 'name');

        $assignments = [
            // Admin — everything
            ['role_id' => $role['Admin'], 'permission_id' => $perm['manage_catalog']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['submit_request']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['approve_request']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['confirm_receipt']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['manage_assets']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['report_damage']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['manage_consumables']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['manage_assignments']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['view_reports']],
            ['role_id' => $role['Admin'], 'permission_id' => $perm['view_own_dept']],

            // Dept_Head — request lifecycle + receipt + damage
            ['role_id' => $role['Dept_Head'], 'permission_id' => $perm['submit_request']],
            ['role_id' => $role['Dept_Head'], 'permission_id' => $perm['confirm_receipt']],
            ['role_id' => $role['Dept_Head'], 'permission_id' => $perm['report_damage']],
            ['role_id' => $role['Dept_Head'], 'permission_id' => $perm['view_own_dept']],

            // Overseer — read-only reporting
            ['role_id' => $role['Overseer'], 'permission_id' => $perm['view_reports']],
            ['role_id' => $role['Overseer'], 'permission_id' => $perm['view_own_dept']],
        ];

        foreach ($assignments as $assignment) {
            DB::table('permission_role')->insertOrIgnore($assignment);
        }
    }
}

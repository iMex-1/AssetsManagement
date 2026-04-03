<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage_catalog',
            'submit_request',
            'approve_request',
            'confirm_receipt',
            'manage_assets',
            'report_damage',
            'manage_consumables',
            'manage_assignments',
            'view_reports',
            'view_own_dept',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $deptHead = Role::firstOrCreate(['name' => 'Dept_Head', 'guard_name' => 'web']);
        $deptHead->syncPermissions([
            'submit_request',
            'confirm_receipt',
            'report_damage',
            'view_own_dept',
        ]);

        $overseer = Role::firstOrCreate(['name' => 'Overseer', 'guard_name' => 'web']);
        $overseer->syncPermissions([
            'view_reports',
            'view_own_dept',
        ]);
    }
}

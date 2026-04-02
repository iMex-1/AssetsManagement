<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            ['name' => 'create', 'description' => 'Create records'],
            ['name' => 'read', 'description' => 'Read records'],
            ['name' => 'update', 'description' => 'Update records'],
            ['name' => 'delete', 'description' => 'Delete records'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->insert(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Create roles
        $roles = [
            ['name' => 'admin', 'description' => 'Administrator with full access'],
            ['name' => 'editor', 'description' => 'Can create, read, and update'],
            ['name' => 'viewer', 'description' => 'Can only read'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->insert(array_merge($role, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Assign permissions to roles
        // Admin gets all permissions
        DB::table('permission_role')->insert([
            ['role_id' => 1, 'permission_id' => 1],
            ['role_id' => 1, 'permission_id' => 2],
            ['role_id' => 1, 'permission_id' => 3],
            ['role_id' => 1, 'permission_id' => 4],
        ]);

        // Editor gets create, read, update
        DB::table('permission_role')->insert([
            ['role_id' => 2, 'permission_id' => 1],
            ['role_id' => 2, 'permission_id' => 2],
            ['role_id' => 2, 'permission_id' => 3],
        ]);

        // Viewer gets only read
        DB::table('permission_role')->insert([
            ['role_id' => 3, 'permission_id' => 2],
        ]);
    }
}

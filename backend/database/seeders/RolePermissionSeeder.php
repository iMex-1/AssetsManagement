<?php

declare(strict_types=1);

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
            'gerer_articles',
            'soumettre_demande',
            'approuver_demande',
            'confirmer_reception',
            'signaler_panne',
            'gerer_affectations',
            'voir_rapports',
            'voir_son_service',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $chefService = Role::firstOrCreate(['name' => 'Chef_Service', 'guard_name' => 'web']);
        $chefService->syncPermissions([
            'soumettre_demande',
            'confirmer_reception',
            'signaler_panne',
            'voir_son_service',
        ]);

        $directeur = Role::firstOrCreate(['name' => 'Directeur', 'guard_name' => 'web']);
        $directeur->syncPermissions([
            'voir_rapports',
            'voir_son_service',
        ]);
    }
}

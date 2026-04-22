<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            ServiceSeeder::class,
            AdminUserSeeder::class,
            TestUserSeeder::class,
            FournisseurSeeder::class,
            ArticleSeeder::class,
            ReceptionSeeder::class,
            DemandeSeeder::class,
            AffectationSeeder::class,
        ]);
    }
}

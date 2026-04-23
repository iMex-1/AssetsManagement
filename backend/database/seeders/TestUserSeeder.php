<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        $chef = User::firstOrCreate(
            ['email' => 'chef@example.com'],
            [
                'nom_complet' => 'Chef Département',
                'password' => Hash::make('password'),
            ]
        );
        $chef->assignRole('Chef_Departement');

        $directeur = User::firstOrCreate(
            ['email' => 'directeur@example.com'],
            [
                'nom_complet' => 'Directeur',
                'password' => Hash::make('password'),
            ]
        );
        $directeur->assignRole('Directeur');
    }
}

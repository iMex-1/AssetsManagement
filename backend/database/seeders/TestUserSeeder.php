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
                'role' => 'Dept_Head',
                'password' => Hash::make('password'),
            ]
        );
        $chef->assignRole('Dept_Head');

        $overseer = User::firstOrCreate(
            ['email' => 'overseer@example.com'],
            [
                'nom_complet' => 'Observateur',
                'role' => 'Overseer',
                'password' => Hash::make('password'),
            ]
        );
        $overseer->assignRole('Overseer');
    }
}

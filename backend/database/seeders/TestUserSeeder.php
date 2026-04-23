<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        $serviceInfo    = Service::where('nom_service', 'Informatique')->first();
        $serviceCompta  = Service::where('nom_service', 'Comptabilité')->first();
        $serviceDir     = Service::where('nom_service', 'Direction Générale')->first();

        // Chef de service — Informatique
        $chef = User::firstOrCreate(
            ['email' => 'chef@example.com'],
            [
                'nom_complet' => 'Karim Benali',
                'service_id'  => $serviceInfo?->id,
                'password'    => Hash::make('password'),
            ]
        );
        $chef->syncRoles(['Chef_Service']);

        // Chef de service — Comptabilité
        $chef2 = User::firstOrCreate(
            ['email' => 'chef2@example.com'],
            [
                'nom_complet' => 'Samira Oukaci',
                'service_id'  => $serviceCompta?->id,
                'password'    => Hash::make('password'),
            ]
        );
        $chef2->syncRoles(['Chef_Service']);

        // Directeur
        $directeur = User::firstOrCreate(
            ['email' => 'directeur@example.com'],
            [
                'nom_complet' => 'Mourad Tlemçani',
                'service_id'  => $serviceDir?->id,
                'password'    => Hash::make('password'),
            ]
        );
        $directeur->syncRoles(['Directeur']);
    }
}

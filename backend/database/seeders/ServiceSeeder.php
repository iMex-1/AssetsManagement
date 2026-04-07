<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['nom_service' => 'Direction Générale'],
            ['nom_service' => 'Ressources Humaines'],
            ['nom_service' => 'Informatique'],
            ['nom_service' => 'Comptabilité'],
            ['nom_service' => 'Logistique'],
            ['nom_service' => 'Communication'],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate($service);
        }
    }
}

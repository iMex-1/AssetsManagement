<?php

namespace Database\Seeders;

use App\Models\Affectation;
use App\Models\Article;
use App\Models\Service;
use Illuminate\Database\Seeder;

class AffectationSeeder extends Seeder
{
    public function run(): void
    {
        $services = Service::all();
        $articles = Article::all();

        if ($services->isEmpty() || $articles->isEmpty()) {
            $this->command->warn('Services or Articles not found. Run required seeders first.');
            return;
        }

        // Affectation 1: Ordinateurs portables au service Informatique
        Affectation::firstOrCreate([
            'article_id' => $articles->where('designation', 'Ordinateur Portable HP')->first()->id,
            'service_id' => $services->where('nom_service', 'Informatique')->first()->id,
            'quantite_affectee' => 5,
            'cible' => 'Équipe Développement',
            'date_action' => now()->subDays(15),
        ]);

        // Affectation 2: Bureaux et chaises au service RH
        Affectation::firstOrCreate([
            'article_id' => $articles->where('designation', 'Bureau Ergonomique')->first()->id,
            'service_id' => $services->where('nom_service', 'Ressources Humaines')->first()->id,
            'quantite_affectee' => 4,
            'cible' => 'Bureaux RH - Étage 2',
            'date_action' => now()->subDays(10),
        ]);

        Affectation::firstOrCreate([
            'article_id' => $articles->where('designation', 'Chaise de Bureau')->first()->id,
            'service_id' => $services->where('nom_service', 'Ressources Humaines')->first()->id,
            'quantite_affectee' => 8,
            'cible' => 'Bureaux RH - Étage 2',
            'date_action' => now()->subDays(10),
        ]);

        // Affectation 3: Imprimante au service Comptabilité
        Affectation::firstOrCreate([
            'article_id' => $articles->where('designation', 'Imprimante Laser')->first()->id,
            'service_id' => $services->where('nom_service', 'Comptabilité')->first()->id,
            'quantite_affectee' => 2,
            'cible' => 'Salle Comptabilité',
            'date_action' => now()->subDays(5),
        ]);

        // Affectation 4: Fournitures au service Communication
        Affectation::firstOrCreate([
            'article_id' => $articles->where('designation', 'Ramette Papier A4')->first()->id,
            'service_id' => $services->where('nom_service', 'Communication')->first()->id,
            'quantite_affectee' => 30,
            'cible' => 'Stock Communication',
            'date_action' => now()->subDays(3),
        ]);
    }
}

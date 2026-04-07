<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Demande;
use App\Models\LigneDemande;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemandeSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $articles = Article::all();

        if ($users->isEmpty() || $articles->isEmpty()) {
            $this->command->warn('Users or Articles not found. Run AdminUserSeeder and ArticleSeeder first.');
            return;
        }

        // Demande 1: En attente
        $demande1 = Demande::firstOrCreate([
            'utilisateur_id' => $users->first()->id,
            'date_creation' => now()->subDays(5),
            'statut' => 'En_attente',
            'bon_scanne' => null,
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande1->id,
            'article_id' => $articles->where('designation', 'Ordinateur Portable HP')->first()->id,
            'quantite_demandee' => 2,
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande1->id,
            'article_id' => $articles->where('designation', 'Écran Dell 24"')->first()->id,
            'quantite_demandee' => 2,
        ]);

        // Demande 2: Validée
        $demande2 = Demande::firstOrCreate([
            'utilisateur_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
            'date_creation' => now()->subDays(10),
            'statut' => 'Valide',
            'bon_scanne' => null,
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande2->id,
            'article_id' => $articles->where('designation', 'Ramette Papier A4')->first()->id,
            'quantite_demandee' => 20,
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande2->id,
            'article_id' => $articles->where('designation', 'Cartouche Encre Noire')->first()->id,
            'quantite_demandee' => 5,
        ]);

        // Demande 3: Livrée
        $demande3 = Demande::firstOrCreate([
            'utilisateur_id' => $users->first()->id,
            'date_creation' => now()->subDays(20),
            'statut' => 'Livre',
            'bon_scanne' => 'bon_livraison_2026_001.pdf',
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande3->id,
            'article_id' => $articles->where('designation', 'Clavier Sans Fil')->first()->id,
            'quantite_demandee' => 5,
        ]);

        LigneDemande::firstOrCreate([
            'demande_id' => $demande3->id,
            'article_id' => $articles->where('designation', 'Souris Optique')->first()->id,
            'quantite_demandee' => 5,
        ]);
    }
}

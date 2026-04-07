<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Fournisseur;
use App\Models\LigneReception;
use App\Models\Reception;
use Illuminate\Database\Seeder;

class ReceptionSeeder extends Seeder
{
    public function run(): void
    {
        $fournisseurs = Fournisseur::all();
        $articles = Article::all();

        if ($fournisseurs->isEmpty() || $articles->isEmpty()) {
            $this->command->warn('Fournisseurs or Articles not found. Run FournisseurSeeder and ArticleSeeder first.');
            return;
        }

        // Réception 1: Matériel informatique
        $reception1 = Reception::firstOrCreate([
            'fournisseur_id' => $fournisseurs->where('raison_sociale', 'TechSupply SARL')->first()->id,
            'type_doc' => 'Marche',
            'numero_doc' => 'M-2026-001',
            'date_reception' => now()->subDays(30),
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception1->id,
            'article_id' => $articles->where('designation', 'Ordinateur Portable HP')->first()->id,
            'quantite_recue' => 10,
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception1->id,
            'article_id' => $articles->where('designation', 'Écran Dell 24"')->first()->id,
            'quantite_recue' => 15,
        ]);

        // Réception 2: Fournitures de bureau
        $reception2 = Reception::firstOrCreate([
            'fournisseur_id' => $fournisseurs->where('raison_sociale', 'Bureau Plus')->first()->id,
            'type_doc' => 'Bon de Commande',
            'numero_doc' => 'BC-2026-045',
            'date_reception' => now()->subDays(15),
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception2->id,
            'article_id' => $articles->where('designation', 'Ramette Papier A4')->first()->id,
            'quantite_recue' => 100,
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception2->id,
            'article_id' => $articles->where('designation', 'Stylo Bleu (Boîte de 50)')->first()->id,
            'quantite_recue' => 50,
        ]);

        // Réception 3: Mobilier
        $reception3 = Reception::firstOrCreate([
            'fournisseur_id' => $fournisseurs->where('raison_sociale', 'Équipements & Services')->first()->id,
            'type_doc' => 'Marche',
            'numero_doc' => 'M-2026-012',
            'date_reception' => now()->subDays(7),
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception3->id,
            'article_id' => $articles->where('designation', 'Bureau Ergonomique')->first()->id,
            'quantite_recue' => 8,
        ]);

        LigneReception::firstOrCreate([
            'reception_id' => $reception3->id,
            'article_id' => $articles->where('designation', 'Chaise de Bureau')->first()->id,
            'quantite_recue' => 20,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Stock values here reflect post-affectation reality (affectations will decrement further)
        // Starting high so the demo shows realistic numbers after AffectationSeeder runs
        $articles = [
            // Matériel informatique
            ['designation' => 'Ordinateur Portable HP',    'categorie' => 'Materiel',   'stock_actuel' => 22, 'seuil_alerte' => 0],
            ['designation' => 'Écran Dell 24"',            'categorie' => 'Materiel',   'stock_actuel' => 28, 'seuil_alerte' => 0],
            ['designation' => 'Clavier Sans Fil',          'categorie' => 'Materiel',   'stock_actuel' => 18, 'seuil_alerte' => 0],
            ['designation' => 'Souris Optique',            'categorie' => 'Materiel',   'stock_actuel' => 22, 'seuil_alerte' => 0],
            ['designation' => 'Imprimante Laser',          'categorie' => 'Materiel',   'stock_actuel' => 7,  'seuil_alerte' => 0],
            ['designation' => 'Switch Réseau 24 ports',    'categorie' => 'Materiel',   'stock_actuel' => 4,  'seuil_alerte' => 0],
            ['designation' => 'Onduleur 1000VA',           'categorie' => 'Materiel',   'stock_actuel' => 6,  'seuil_alerte' => 0],
            // Mobilier
            ['designation' => 'Bureau Ergonomique',        'categorie' => 'Materiel',   'stock_actuel' => 14, 'seuil_alerte' => 0],
            ['designation' => 'Chaise de Bureau',          'categorie' => 'Materiel',   'stock_actuel' => 30, 'seuil_alerte' => 0],
            ['designation' => 'Armoire de Rangement',      'categorie' => 'Materiel',   'stock_actuel' => 8,  'seuil_alerte' => 0],
            // Fournitures
            ['designation' => 'Ramette Papier A4',         'categorie' => 'Fourniture', 'stock_actuel' => 180, 'seuil_alerte' => 50],
            ['designation' => 'Stylo Bleu (Boîte 50)',     'categorie' => 'Fourniture', 'stock_actuel' => 60,  'seuil_alerte' => 20],
            ['designation' => 'Cartouche Encre Noire',     'categorie' => 'Fourniture', 'stock_actuel' => 12,  'seuil_alerte' => 15],  // intentionally low-stock
            ['designation' => 'Cartouche Encre Couleur',   'categorie' => 'Fourniture', 'stock_actuel' => 8,   'seuil_alerte' => 15],  // intentionally low-stock
            ['designation' => 'Classeur à Levier',         'categorie' => 'Fourniture', 'stock_actuel' => 90,  'seuil_alerte' => 30],
            ['designation' => 'Cahier 200 Pages',          'categorie' => 'Fourniture', 'stock_actuel' => 55,  'seuil_alerte' => 20],
            ['designation' => 'Agrafeuse Professionnelle', 'categorie' => 'Fourniture', 'stock_actuel' => 18,  'seuil_alerte' => 10],
            ['designation' => 'Ruban Adhésif (lot 10)',    'categorie' => 'Fourniture', 'stock_actuel' => 40,  'seuil_alerte' => 15],
        ];

        foreach ($articles as $article) {
            Article::firstOrCreate(
                ['designation' => $article['designation']],
                $article
            );
        }
    }
}

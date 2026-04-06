<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            // Matériel
            ['designation' => 'Ordinateur Portable HP', 'categorie' => 'Materiel', 'stock_actuel' => 15, 'seuil_alerte' => 5],
            ['designation' => 'Écran Dell 24"', 'categorie' => 'Materiel', 'stock_actuel' => 20, 'seuil_alerte' => 8],
            ['designation' => 'Clavier Sans Fil', 'categorie' => 'Materiel', 'stock_actuel' => 30, 'seuil_alerte' => 10],
            ['designation' => 'Souris Optique', 'categorie' => 'Materiel', 'stock_actuel' => 35, 'seuil_alerte' => 15],
            ['designation' => 'Imprimante Laser', 'categorie' => 'Materiel', 'stock_actuel' => 8, 'seuil_alerte' => 3],
            ['designation' => 'Bureau Ergonomique', 'categorie' => 'Materiel', 'stock_actuel' => 12, 'seuil_alerte' => 5],
            ['designation' => 'Chaise de Bureau', 'categorie' => 'Materiel', 'stock_actuel' => 25, 'seuil_alerte' => 10],
            
            // Fournitures
            ['designation' => 'Ramette Papier A4', 'categorie' => 'Fourniture', 'stock_actuel' => 150, 'seuil_alerte' => 50],
            ['designation' => 'Stylo Bleu (Boîte de 50)', 'categorie' => 'Fourniture', 'stock_actuel' => 80, 'seuil_alerte' => 20],
            ['designation' => 'Cartouche Encre Noire', 'categorie' => 'Fourniture', 'stock_actuel' => 45, 'seuil_alerte' => 15],
            ['designation' => 'Cartouche Encre Couleur', 'categorie' => 'Fourniture', 'stock_actuel' => 40, 'seuil_alerte' => 15],
            ['designation' => 'Agrafeuse Professionnelle', 'categorie' => 'Fourniture', 'stock_actuel' => 25, 'seuil_alerte' => 10],
            ['designation' => 'Classeur à Levier', 'categorie' => 'Fourniture', 'stock_actuel' => 100, 'seuil_alerte' => 30],
            ['designation' => 'Cahier 200 Pages', 'categorie' => 'Fourniture', 'stock_actuel' => 60, 'seuil_alerte' => 20],
        ];

        foreach ($articles as $article) {
            Article::firstOrCreate(
                ['designation' => $article['designation']],
                $article
            );
        }
    }
}

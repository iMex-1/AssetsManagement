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
        $f = Fournisseur::all()->keyBy('raison_sociale');
        $a = Article::all()->keyBy('designation');

        // ── Réception 1 : Matériel informatique (il y a 5 mois) ──────────────
        $r1 = Reception::firstOrCreate(['numero_doc' => 'M-2025-001'], [
            'fournisseur_id' => $f['TechSupply SARL']->id,
            'type_doc'       => 'Marche',
            'date_reception' => now()->subMonths(5)->startOfMonth()->addDays(3),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r1->id, 'article_id' => $a['Ordinateur Portable HP']->id], [
            'quantite_recue' => 12, 'prix_unitaire' => 85000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r1->id, 'article_id' => $a['Écran Dell 24"']->id], [
            'quantite_recue' => 12, 'prix_unitaire' => 32000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r1->id, 'article_id' => $a['Clavier Sans Fil']->id], [
            'quantite_recue' => 12, 'prix_unitaire' => 4500.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r1->id, 'article_id' => $a['Souris Optique']->id], [
            'quantite_recue' => 12, 'prix_unitaire' => 2800.00,
        ]);

        // ── Réception 2 : Fournitures de bureau (il y a 4 mois) ──────────────
        $r2 = Reception::firstOrCreate(['numero_doc' => 'BC-2025-045'], [
            'fournisseur_id' => $f['Bureau Plus']->id,
            'type_doc'       => 'Bon de Commande',
            'date_reception' => now()->subMonths(4)->startOfMonth()->addDays(7),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r2->id, 'article_id' => $a['Ramette Papier A4']->id], [
            'quantite_recue' => 100, 'prix_unitaire' => 45.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r2->id, 'article_id' => $a['Stylo Bleu (Boîte 50)']->id], [
            'quantite_recue' => 30, 'prix_unitaire' => 320.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r2->id, 'article_id' => $a['Classeur à Levier']->id], [
            'quantite_recue' => 50, 'prix_unitaire' => 85.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r2->id, 'article_id' => $a['Cahier 200 Pages']->id], [
            'quantite_recue' => 30, 'prix_unitaire' => 55.00,
        ]);

        // ── Réception 3 : Mobilier (il y a 3 mois) ───────────────────────────
        $r3 = Reception::firstOrCreate(['numero_doc' => 'M-2025-012'], [
            'fournisseur_id' => $f['Équipements & Services']->id,
            'type_doc'       => 'Marche',
            'date_reception' => now()->subMonths(3)->startOfMonth()->addDays(5),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r3->id, 'article_id' => $a['Bureau Ergonomique']->id], [
            'quantite_recue' => 10, 'prix_unitaire' => 24000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r3->id, 'article_id' => $a['Chaise de Bureau']->id], [
            'quantite_recue' => 20, 'prix_unitaire' => 12500.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r3->id, 'article_id' => $a['Armoire de Rangement']->id], [
            'quantite_recue' => 5, 'prix_unitaire' => 18000.00,
        ]);

        // ── Réception 4 : Réseau & énergie (il y a 2 mois) ───────────────────
        $r4 = Reception::firstOrCreate(['numero_doc' => 'BC-2025-089'], [
            'fournisseur_id' => $f['Informatique Pro']->id,
            'type_doc'       => 'Bon de Commande',
            'date_reception' => now()->subMonths(2)->startOfMonth()->addDays(10),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r4->id, 'article_id' => $a['Switch Réseau 24 ports']->id], [
            'quantite_recue' => 3, 'prix_unitaire' => 45000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r4->id, 'article_id' => $a['Onduleur 1000VA']->id], [
            'quantite_recue' => 4, 'prix_unitaire' => 22000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r4->id, 'article_id' => $a['Imprimante Laser']->id], [
            'quantite_recue' => 4, 'prix_unitaire' => 38000.00,
        ]);

        // ── Réception 5 : Fournitures réapprovisionnement (mois dernier) ──────
        $r5 = Reception::firstOrCreate(['numero_doc' => 'BC-2026-012'], [
            'fournisseur_id' => $f['Fournitures Modernes']->id,
            'type_doc'       => 'Bon de Commande',
            'date_reception' => now()->subMonth()->startOfMonth()->addDays(2),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r5->id, 'article_id' => $a['Cartouche Encre Noire']->id], [
            'quantite_recue' => 20, 'prix_unitaire' => 1800.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r5->id, 'article_id' => $a['Cartouche Encre Couleur']->id], [
            'quantite_recue' => 15, 'prix_unitaire' => 2200.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r5->id, 'article_id' => $a['Agrafeuse Professionnelle']->id], [
            'quantite_recue' => 10, 'prix_unitaire' => 950.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r5->id, 'article_id' => $a['Ruban Adhésif (lot 10)']->id], [
            'quantite_recue' => 20, 'prix_unitaire' => 180.00,
        ]);

        // ── Réception 6 : Ce mois-ci ──────────────────────────────────────────
        $r6 = Reception::firstOrCreate(['numero_doc' => 'M-2026-003'], [
            'fournisseur_id' => $f['TechSupply SARL']->id,
            'type_doc'       => 'Marche',
            'date_reception' => now()->subDays(5),
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r6->id, 'article_id' => $a['Ordinateur Portable HP']->id], [
            'quantite_recue' => 10, 'prix_unitaire' => 87000.00,
        ]);
        LigneReception::firstOrCreate(['reception_id' => $r6->id, 'article_id' => $a['Écran Dell 24"']->id], [
            'quantite_recue' => 16, 'prix_unitaire' => 33000.00,
        ]);
    }
}

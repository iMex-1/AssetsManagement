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
        $a     = Article::all()->keyBy('designation');
        $chef  = User::where('email', 'chef@example.com')->first();
        $chef2 = User::where('email', 'chef2@example.com')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        // ── Demandes de Karim (Informatique) ─────────────────────────────────

        // Livrée — il y a 4 mois
        $d1 = Demande::firstOrCreate(['utilisateur_id' => $chef->id, 'date_creation' => now()->subMonths(4)->startOfMonth()->addDays(2)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d1->id, 'article_id' => $a['Clavier Sans Fil']->id],          ['quantite_demandee' => 5, 'motif' => 'Remplacement claviers défectueux']);
        LigneDemande::firstOrCreate(['demande_id' => $d1->id, 'article_id' => $a['Souris Optique']->id],            ['quantite_demandee' => 5, 'motif' => 'Remplacement souris défectueuses']);

        // Livrée — il y a 3 mois
        $d2 = Demande::firstOrCreate(['utilisateur_id' => $chef->id, 'date_creation' => now()->subMonths(3)->startOfMonth()->addDays(5)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d2->id, 'article_id' => $a['Ramette Papier A4']->id],         ['quantite_demandee' => 20, 'motif' => 'Stock mensuel']);
        LigneDemande::firstOrCreate(['demande_id' => $d2->id, 'article_id' => $a['Cartouche Encre Noire']->id],     ['quantite_demandee' => 4,  'motif' => 'Imprimante service']);

        // Livrée — il y a 2 mois
        $d3 = Demande::firstOrCreate(['utilisateur_id' => $chef->id, 'date_creation' => now()->subMonths(2)->startOfMonth()->addDays(8)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d3->id, 'article_id' => $a['Ordinateur Portable HP']->id],    ['quantite_demandee' => 3, 'motif' => 'Nouveaux recrutements']);
        LigneDemande::firstOrCreate(['demande_id' => $d3->id, 'article_id' => $a['Écran Dell 24"']->id],            ['quantite_demandee' => 3, 'motif' => 'Nouveaux recrutements']);

        // Validée — mois dernier
        $d4 = Demande::firstOrCreate(['utilisateur_id' => $chef->id, 'date_creation' => now()->subMonth()->startOfMonth()->addDays(3)], [
            'statut' => 'Valide',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d4->id, 'article_id' => $a['Onduleur 1000VA']->id],           ['quantite_demandee' => 2, 'motif' => 'Protection serveurs']);

        // En attente — cette semaine
        $d5 = Demande::firstOrCreate(['utilisateur_id' => $chef->id, 'date_creation' => now()->subDays(3)], [
            'statut' => 'En_attente',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d5->id, 'article_id' => $a['Cartouche Encre Noire']->id],     ['quantite_demandee' => 6, 'motif' => 'Stock critique']);
        LigneDemande::firstOrCreate(['demande_id' => $d5->id, 'article_id' => $a['Cartouche Encre Couleur']->id],   ['quantite_demandee' => 4, 'motif' => 'Stock critique']);

        // ── Demandes de Samira (Comptabilité) ─────────────────────────────────

        // Livrée — il y a 3 mois
        $d6 = Demande::firstOrCreate(['utilisateur_id' => $chef2->id, 'date_creation' => now()->subMonths(3)->startOfMonth()->addDays(12)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d6->id, 'article_id' => $a['Classeur à Levier']->id],         ['quantite_demandee' => 20, 'motif' => 'Archivage annuel']);
        LigneDemande::firstOrCreate(['demande_id' => $d6->id, 'article_id' => $a['Cahier 200 Pages']->id],          ['quantite_demandee' => 10, 'motif' => 'Registres comptables']);

        // Livrée — il y a 2 mois
        $d7 = Demande::firstOrCreate(['utilisateur_id' => $chef2->id, 'date_creation' => now()->subMonths(2)->startOfMonth()->addDays(15)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d7->id, 'article_id' => $a['Imprimante Laser']->id],          ['quantite_demandee' => 1, 'motif' => 'Remplacement imprimante HS']);
        LigneDemande::firstOrCreate(['demande_id' => $d7->id, 'article_id' => $a['Ramette Papier A4']->id],         ['quantite_demandee' => 30, 'motif' => 'Besoin mensuel']);

        // Livrée — mois dernier
        $d8 = Demande::firstOrCreate(['utilisateur_id' => $chef2->id, 'date_creation' => now()->subMonth()->startOfMonth()->addDays(6)], [
            'statut' => 'Livre',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d8->id, 'article_id' => $a['Bureau Ergonomique']->id],        ['quantite_demandee' => 2, 'motif' => 'Nouveaux postes']);
        LigneDemande::firstOrCreate(['demande_id' => $d8->id, 'article_id' => $a['Chaise de Bureau']->id],          ['quantite_demandee' => 4, 'motif' => 'Nouveaux postes']);

        // En attente — aujourd'hui
        $d9 = Demande::firstOrCreate(['utilisateur_id' => $chef2->id, 'date_creation' => now()->subDays(1)], [
            'statut' => 'En_attente',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d9->id, 'article_id' => $a['Agrafeuse Professionnelle']->id], ['quantite_demandee' => 3, 'motif' => 'Remplacement']);
        LigneDemande::firstOrCreate(['demande_id' => $d9->id, 'article_id' => $a['Ruban Adhésif (lot 10)']->id],   ['quantite_demandee' => 5, 'motif' => 'Stock épuisé']);

        // ── Demande admin ─────────────────────────────────────────────────────
        $d10 = Demande::firstOrCreate(['utilisateur_id' => $admin->id, 'date_creation' => now()->subDays(7)], [
            'statut' => 'Valide',
        ]);
        LigneDemande::firstOrCreate(['demande_id' => $d10->id, 'article_id' => $a['Switch Réseau 24 ports']->id],   ['quantite_demandee' => 2, 'motif' => 'Extension réseau salle serveurs']);
    }
}

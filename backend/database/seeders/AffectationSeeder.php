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
        $a = Article::all()->keyBy('designation');
        $s = Service::all()->keyBy('nom_service');

        $affectations = [
            // ── Informatique ─────────────────────────────────────────────────
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 8,
                'cible'             => 'Équipe développement — Bât. A',
                'date_action'       => now()->subMonths(4)->addDays(5),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 1,
                'cible'             => 'Poste administrateur réseau',
                'date_action'       => now()->subMonths(2)->addDays(3),
                'etat'              => 'en_panne',   // demo: panne signalée
            ],
            [
                'article_id'        => $a['Écran Dell 24"']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 8,
                'cible'             => 'Équipe développement — Bât. A',
                'date_action'       => now()->subMonths(4)->addDays(5),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Switch Réseau 24 ports']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 2,
                'cible'             => 'Salle serveurs — Sous-sol',
                'date_action'       => now()->subMonths(2)->addDays(12),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Onduleur 1000VA']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 2,
                'cible'             => 'Salle serveurs — Sous-sol',
                'date_action'       => now()->subMonths(2)->addDays(12),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Clavier Sans Fil']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 5,
                'cible'             => 'Équipe développement',
                'date_action'       => now()->subMonths(4)->addDays(6),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Souris Optique']->id,
                'service_id'        => $s['Informatique']->id,
                'quantite_affectee' => 5,
                'cible'             => 'Équipe développement',
                'date_action'       => now()->subMonths(4)->addDays(6),
                'etat'              => 'en_service',
            ],

            // ── Comptabilité ─────────────────────────────────────────────────
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Comptabilité']->id,
                'quantite_affectee' => 4,
                'cible'             => 'Pôle comptabilité — Étage 1',
                'date_action'       => now()->subMonths(3)->addDays(2),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Imprimante Laser']->id,
                'service_id'        => $s['Comptabilité']->id,
                'quantite_affectee' => 2,
                'cible'             => 'Salle Comptabilité',
                'date_action'       => now()->subMonths(2)->addDays(16),
                'etat'              => 'en_reparation', // demo: en réparation
            ],
            [
                'article_id'        => $a['Bureau Ergonomique']->id,
                'service_id'        => $s['Comptabilité']->id,
                'quantite_affectee' => 4,
                'cible'             => 'Pôle comptabilité — Étage 1',
                'date_action'       => now()->subMonth()->addDays(7),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Chaise de Bureau']->id,
                'service_id'        => $s['Comptabilité']->id,
                'quantite_affectee' => 6,
                'cible'             => 'Pôle comptabilité — Étage 1',
                'date_action'       => now()->subMonth()->addDays(7),
                'etat'              => 'en_service',
            ],

            // ── Ressources Humaines ───────────────────────────────────────────
            [
                'article_id'        => $a['Bureau Ergonomique']->id,
                'service_id'        => $s['Ressources Humaines']->id,
                'quantite_affectee' => 4,
                'cible'             => 'Bureaux RH — Étage 2',
                'date_action'       => now()->subMonths(3)->addDays(8),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Chaise de Bureau']->id,
                'service_id'        => $s['Ressources Humaines']->id,
                'quantite_affectee' => 8,
                'cible'             => 'Bureaux RH — Étage 2',
                'date_action'       => now()->subMonths(3)->addDays(8),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Ressources Humaines']->id,
                'quantite_affectee' => 3,
                'cible'             => 'Pôle recrutement',
                'date_action'       => now()->subMonths(5)->addDays(10),
                'etat'              => 'en_service',
            ],

            // ── Direction Générale ────────────────────────────────────────────
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Direction Générale']->id,
                'quantite_affectee' => 2,
                'cible'             => 'Bureau direction',
                'date_action'       => now()->subMonths(5)->addDays(1),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Écran Dell 24"']->id,
                'service_id'        => $s['Direction Générale']->id,
                'quantite_affectee' => 2,
                'cible'             => 'Bureau direction',
                'date_action'       => now()->subMonths(5)->addDays(1),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Armoire de Rangement']->id,
                'service_id'        => $s['Direction Générale']->id,
                'quantite_affectee' => 3,
                'cible'             => 'Secrétariat direction',
                'date_action'       => now()->subMonths(3)->addDays(14),
                'etat'              => 'en_service',
            ],

            // ── Logistique ────────────────────────────────────────────────────
            [
                'article_id'        => $a['Imprimante Laser']->id,
                'service_id'        => $s['Logistique']->id,
                'quantite_affectee' => 1,
                'cible'             => 'Bureau logistique',
                'date_action'       => now()->subMonths(2)->addDays(20),
                'etat'              => 'en_service',
            ],
            [
                'article_id'        => $a['Chaise de Bureau']->id,
                'service_id'        => $s['Logistique']->id,
                'quantite_affectee' => 6,
                'cible'             => 'Salle de réunion logistique',
                'date_action'       => now()->subMonths(3)->addDays(18),
                'etat'              => 'en_service',
            ],

            // ── Communication ─────────────────────────────────────────────────
            [
                'article_id'        => $a['Ordinateur Portable HP']->id,
                'service_id'        => $s['Communication']->id,
                'quantite_affectee' => 1,
                'cible'             => 'Chargé de communication',
                'date_action'       => now()->subMonths(4)->addDays(15),
                'etat'              => 'hors_service', // demo: mis au rebut
                'date_fin'          => now()->subMonth()->toDateString(),
            ],
        ];

        foreach ($affectations as $data) {
            Affectation::create($data);
        }

        // Décrémenter le stock pour chaque affectation active (hors hors_service déjà géré)
        foreach ($affectations as $data) {
            if ($data['etat'] !== 'hors_service') {
                Article::where('id', $data['article_id'])
                    ->decrement('stock_actuel', $data['quantite_affectee']);
            } else {
                // hors_service : stock déjà décrémenté à l'affectation, puis re-décrémenté à la mise HS
                // On décrémente une seule fois ici (la mise HS est simulée directement)
                Article::where('id', $data['article_id'])
                    ->decrement('stock_actuel', $data['quantite_affectee']);
            }
        }
    }
}

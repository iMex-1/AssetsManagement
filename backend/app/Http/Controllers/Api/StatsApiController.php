<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\Article;
use App\Models\Demande;
use App\Models\Reception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->can('voir_rapports')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $articles     = Article::all(['id', 'designation', 'categorie', 'stock_actuel', 'seuil_alerte']);
        $demandes     = Demande::with('lignes')->get(['id', 'statut', 'date_creation', 'utilisateur_id']);
        $receptions   = Reception::with('lignes')->get(['id', 'date_reception']);
        $affectations = Affectation::with('article:id,designation')->get(['id', 'article_id', 'quantite_affectee', 'etat']);

        $lowStock = $articles->filter(fn ($a) => $a->stock_actuel <= $a->seuil_alerte)->values();

        $demandesByStatut = $demandes->groupBy('statut')->map->count();

        $approvalRate = $demandes->count() > 0
            ? round((($demandesByStatut['Valide'] ?? 0) + ($demandesByStatut['Livre'] ?? 0)) / $demandes->count() * 100)
            : 0;

        // Receptions per month (last 6 months)
        $monthlyReceptions = [];
        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $count = $receptions->filter(function ($r) use ($date) {
                $d = \Carbon\Carbon::parse($r->date_reception);
                return $d->month === $date->month && $d->year === $date->year;
            })->count();
            $monthlyReceptions[] = [
                'label' => $date->locale('fr')->isoFormat('MMM YY'),
                'count' => $count,
            ];
        }

        // Top articles by affectation
        $affByArticle = $affectations
            ->groupBy(fn ($af) => $af->article?->designation ?? "#{$af->article_id}")
            ->map(fn ($group) => $group->sum('quantite_affectee'))
            ->sortDesc()
            ->take(8);

        // Total expenditure from ligne_receptions
        $totalDepenses = \App\Models\LigneReception::selectRaw('SUM(quantite_recue * prix_unitaire) as total')
            ->value('total') ?? 0;

        // Affectations by état
        $parEtat = $affectations->groupBy('etat')->map->count();

        // Service activity heatmap: quantité d'articles livrés par service par mois (12 derniers mois)
        $heatmap = $this->buildServiceHeatmap();

        return response()->json([
            'articles' => [
                'total'             => $articles->count(),
                'low_stock'         => $lowStock->values(),
                'total_stock_units' => $articles->sum('stock_actuel'),
            ],
            'demandes' => [
                'total'         => $demandes->count(),
                'by_statut'     => $demandesByStatut,
                'approval_rate' => $approvalRate,
            ],
            'receptions' => [
                'total'   => $receptions->count(),
                'monthly' => $monthlyReceptions,
            ],
            'affectations' => [
                'total'        => $affectations->count(),
                'top_articles' => $affByArticle,
                'par_etat'     => $parEtat,
            ],
            'finances' => [
                'total_depenses' => round((float) $totalDepenses, 2),
            ],
            'heatmap' => $heatmap,
        ]);
    }

    private function buildServiceHeatmap(): array
    {
        // 12 derniers mois
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $months[] = now()->subMonths($i)->format('Y-m');
        }

        // Demandes livrées avec leurs lignes et le service du demandeur
        $rows = \Illuminate\Support\Facades\DB::table('demandes')
            ->join('users', 'demandes.utilisateur_id', '=', 'users.id')
            ->join('services', 'users.service_id', '=', 'services.id')
            ->join('ligne_demandes', 'demandes.id', '=', 'ligne_demandes.demande_id')
            ->where('demandes.statut', 'Livre')
            ->whereNotNull('users.service_id')
            ->selectRaw('services.id as service_id, services.nom_service, DATE_FORMAT(demandes.date_creation, "%Y-%m") as mois, SUM(ligne_demandes.quantite_demandee) as total')
            ->groupBy('services.id', 'services.nom_service', 'mois')
            ->get();

        // Organiser par service
        $byService = [];
        foreach ($rows as $row) {
            $byService[$row->service_id]['label'] = $row->nom_service;
            $byService[$row->service_id]['data'][$row->mois] = (int) $row->total;
        }

        // Normaliser avec tous les mois (0 si absent)
        $result = [];
        foreach ($byService as $serviceId => $info) {
            $data = [];
            foreach ($months as $m) {
                $data[] = $info['data'][$m] ?? 0;
            }
            $result[] = [
                'service_id' => $serviceId,
                'label'      => $info['label'],
                'data'       => $data,
            ];
        }

        return [
            'months'   => array_map(fn ($m) => \Carbon\Carbon::createFromFormat('Y-m', $m)->locale('fr')->isoFormat('MMM YY'), $months),
            'services' => $result,
        ];
    }
}

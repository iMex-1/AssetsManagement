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

class StatsApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->can('view_reports')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $articles = Article::all(['id', 'designation', 'categorie', 'stock_actuel', 'seuil_alerte']);
        $demandes = Demande::with('lignes')->get(['id', 'statut', 'date_creation']);
        $receptions = Reception::all(['id', 'date_reception']);
        $affectations = Affectation::with('article:id,designation')->get(['id', 'article_id', 'quantite_affectee']);

        $lowStock = $articles->filter(fn ($a) => $a->stock_actuel <= $a->seuil_alerte)->values();

        $demandesByStatut = $demandes->groupBy('statut')->map->count();

        $approvalRate = $demandes->count() > 0
            ? round((($demandesByStatut['Valide'] ?? 0) + ($demandesByStatut['Livre'] ?? 0)) / $demandes->count() * 100)
            : 0;

        // Receptions per month (last 6 months)
        $monthlyReceptions = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
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
        $affByArticle = $affectations->groupBy(fn ($af) => $af->article?->designation ?? "#{$af->article_id}")
            ->map(fn ($group) => $group->sum('quantite_affectee'))
            ->sortDesc()
            ->take(8);

        return response()->json([
            'articles' => [
                'total'     => $articles->count(),
                'low_stock' => $lowStock->values(),
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
                'total'   => $affectations->count(),
                'top_articles' => $affByArticle,
            ],
        ]);
    }
}

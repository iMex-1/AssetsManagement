<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Affectation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'article_id',
        'service_id',
        'quantite_affectee',
        'cible',           // ex: Matricule Vehicule, Poteau X, Bureau
        'coordonnees_gps', // Pour eclairage
        'photo_jointe',    // Preuve d'installation
        'date_action',
    ];

    protected $casts = [
        'date_action' => 'date',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}

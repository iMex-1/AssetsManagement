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
        'cible',
        'coordonnees_gps',
        'photo_jointe',
        'date_action',
        'etat',
        'date_fin',
    ];

    protected $casts = [
        'date_action' => 'date',
        'date_fin'    => 'date',
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

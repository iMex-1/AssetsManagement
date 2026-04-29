<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Affectation extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'article_id',
        'service_id',
        'quantite_affectee',
        'cible',
        'coordonnees_gps',
        'date_action',
        'etat',
        'date_fin',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo_jointe')
            ->singleFile(); // Only one photo per assignment
    }

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

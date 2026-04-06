<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Demande extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'utilisateur_id',
        'date_creation',
        'statut', // En_attente, Valide, Livre
        'bon_scanne',
    ];

    protected $casts = [
        'date_creation' => 'date',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneDemande::class, 'demande_id');
    }
}

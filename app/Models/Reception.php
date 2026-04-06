<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reception extends Model
{
    use HasFactory;

    protected $fillable = [
        'fournisseur_id',
        'type_doc', // Marche ou Bon de Commande
        'numero_doc',
        'date_reception',
    ];

    protected $casts = [
        'date_reception' => 'date',
    ];

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneReception::class, 'reception_id');
    }
}

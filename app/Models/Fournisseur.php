<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fournisseur extends Model
{
    use HasFactory;

    protected $fillable = ['raison_sociale', 'telephone'];

    public function receptions(): HasMany
    {
        return $this->hasMany(Reception::class, 'fournisseur_id');
    }
}

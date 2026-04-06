<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fournisseur extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['raison_sociale', 'telephone'];

    public function receptions(): HasMany
    {
        return $this->hasMany(Reception::class, 'fournisseur_id');
    }
}

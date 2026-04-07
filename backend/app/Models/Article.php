<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'designation',
        'categorie', // Materiel ou Fourniture
        'stock_actuel',
        'seuil_alerte',
    ];

    public function ligneReceptions(): HasMany
    {
        return $this->hasMany(LigneReception::class, 'article_id');
    }

    public function ligneDemandes(): HasMany
    {
        return $this->hasMany(LigneDemande::class, 'article_id');
    }

    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class, 'article_id');
    }
}

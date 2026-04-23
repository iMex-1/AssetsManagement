<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneReception extends Model
{
    use HasFactory;

    protected $fillable = [
        'reception_id',
        'article_id',
        'quantite_recue',
        'prix_unitaire',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
    ];

    public function reception(): BelongsTo
    {
        return $this->belongsTo(Reception::class, 'reception_id');
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}

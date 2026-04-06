<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['nom_service'];

    public function utilisateurs(): HasMany
    {
        return $this->hasMany(User::class, 'service_id');
    }

    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class, 'service_id');
    }
}

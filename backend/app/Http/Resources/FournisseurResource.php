<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FournisseurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'raison_sociale' => $this->raison_sociale,
            'telephone'      => $this->telephone,
            'deleted_at'     => $this->deleted_at,
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}

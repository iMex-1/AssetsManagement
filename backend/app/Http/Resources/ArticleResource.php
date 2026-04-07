<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'designation'  => $this->designation,
            'categorie'    => $this->categorie,
            'stock_actuel' => $this->stock_actuel,
            'seuil_alerte' => $this->seuil_alerte,
            'is_low_stock' => $this->stock_actuel <= $this->seuil_alerte,
            'deleted_at'   => $this->deleted_at,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}

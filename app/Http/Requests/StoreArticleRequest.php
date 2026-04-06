<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designation'  => ['required', 'string'],
            'categorie'    => ['required', 'string', 'in:Materiel,Fourniture'],
            'stock_actuel' => ['required', 'integer', 'min:0'],
            'seuil_alerte' => ['required', 'integer', 'min:0'],
        ];
    }
}

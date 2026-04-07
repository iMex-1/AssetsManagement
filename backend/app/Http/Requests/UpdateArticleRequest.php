<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designation'  => ['sometimes', 'string'],
            'categorie'    => ['sometimes', 'string', 'in:Materiel,Fourniture'],
            'stock_actuel' => ['sometimes', 'integer', 'min:0'],
            'seuil_alerte' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}

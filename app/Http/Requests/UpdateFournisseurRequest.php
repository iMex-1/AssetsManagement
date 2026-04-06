<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFournisseurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'raison_sociale' => ['sometimes', 'string', 'max:255'],
            'telephone'      => ['sometimes', 'nullable', 'string', 'max:20'],
        ];
    }
}

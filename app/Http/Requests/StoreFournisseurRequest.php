<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFournisseurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'raison_sociale' => ['required', 'string', 'max:255'],
            'telephone'      => ['nullable', 'string', 'max:20'],
        ];
    }
}

@extends('layouts.app')

@section('title', 'Modifier le fournisseur')

@section('content')
<div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Modifier le fournisseur</h1>

    <form action="{{ route('fournisseurs.update', $fournisseur) }}" method="POST" class="bg-white shadow rounded p-6 space-y-4">
        @csrf
        @method('PUT')

        <div>
            <label class="block text-sm font-medium text-gray-700">Raison sociale</label>
            <input type="text" name="raison_sociale" value="{{ old('raison_sociale', $fournisseur->raison_sociale) }}" maxlength="255"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('raison_sociale') border-red-500 @enderror">
            @error('raison_sociale')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone <span class="text-gray-400">(optionnel)</span></label>
            <input type="text" name="telephone" value="{{ old('telephone', $fournisseur->telephone) }}" maxlength="20"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('telephone') border-red-500 @enderror">
            @error('telephone')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex space-x-3">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            <a href="{{ route('fournisseurs.index') }}" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Annuler</a>
        </div>
    </form>
</div>
@endsection

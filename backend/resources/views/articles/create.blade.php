@extends('layouts.app')

@section('title', 'Nouvel article')

@section('content')
<div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Nouvel article</h1>

    <form action="{{ route('articles.store') }}" method="POST" class="bg-white shadow rounded p-6 space-y-4">
        @csrf

        <div>
            <label class="block text-sm font-medium text-gray-700">Désignation</label>
            <input type="text" name="designation" value="{{ old('designation') }}"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('designation') border-red-500 @enderror">
            @error('designation')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select name="categorie"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('categorie') border-red-500 @enderror">
                <option value="">-- Choisir --</option>
                <option value="Materiel" {{ old('categorie') === 'Materiel' ? 'selected' : '' }}>Matériel</option>
                <option value="Fourniture" {{ old('categorie') === 'Fourniture' ? 'selected' : '' }}>Fourniture</option>
            </select>
            @error('categorie')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Stock actuel</label>
            <input type="number" name="stock_actuel" value="{{ old('stock_actuel', 0) }}" min="0"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('stock_actuel') border-red-500 @enderror">
            @error('stock_actuel')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Seuil d'alerte</label>
            <input type="number" name="seuil_alerte" value="{{ old('seuil_alerte', 0) }}" min="0"
                class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 @error('seuil_alerte') border-red-500 @enderror">
            @error('seuil_alerte')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex space-x-3">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
            <a href="{{ route('articles.index') }}" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Annuler</a>
        </div>
    </form>
</div>
@endsection

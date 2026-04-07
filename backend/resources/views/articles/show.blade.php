@extends('layouts.app')

@section('title', 'Détail article')

@section('content')
<div class="max-w-lg mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ $article->designation }}</h1>
        @if($article->stock_actuel <= $article->seuil_alerte)
            <span class="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                Stock bas
            </span>
        @endif
    </div>

    <div class="bg-white shadow rounded p-6 space-y-3">
        <div class="flex justify-between">
            <span class="text-gray-500">Catégorie</span>
            <span class="font-medium">{{ $article->categorie }}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-500">Stock actuel</span>
            <span class="font-medium">{{ $article->stock_actuel }}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-500">Seuil d'alerte</span>
            <span class="font-medium">{{ $article->seuil_alerte }}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-500">Créé le</span>
            <span class="font-medium">{{ $article->created_at->format('d/m/Y') }}</span>
        </div>
    </div>

    <div class="mt-4 flex space-x-3">
        <a href="{{ route('articles.edit', $article) }}" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Modifier</a>
        <a href="{{ route('articles.index') }}" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Retour</a>
    </div>
</div>
@endsection

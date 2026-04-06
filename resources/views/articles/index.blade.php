@extends('layouts.app')

@section('title', 'Articles')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Articles</h1>
    <a href="{{ route('articles.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Nouvel article
    </a>
</div>

<div class="bg-white shadow rounded overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock actuel</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seuil alerte</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @forelse($articles as $article)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ $article->designation }}
                    @if($article->stock_actuel <= $article->seuil_alerte)
                        <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Stock bas
                        </span>
                    @endif
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $article->categorie }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $article->stock_actuel }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $article->seuil_alerte }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <a href="{{ route('articles.show', $article) }}" class="text-blue-600 hover:underline">Voir</a>
                    <a href="{{ route('articles.edit', $article) }}" class="text-yellow-600 hover:underline">Modifier</a>
                    <form action="{{ route('articles.destroy', $article) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:underline"
                            onclick="return confirm('Supprimer cet article ?')">Supprimer</button>
                    </form>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">Aucun article trouvé.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $articles->links() }}
</div>
@endsection

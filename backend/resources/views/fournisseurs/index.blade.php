@extends('layouts.app')

@section('title', 'Fournisseurs')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Fournisseurs</h1>
    <a href="{{ route('fournisseurs.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Nouveau fournisseur
    </a>
</div>

<div class="bg-white shadow rounded overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison sociale</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @forelse($fournisseurs as $fournisseur)
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $fournisseur->raison_sociale }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $fournisseur->telephone ?? '—' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <a href="{{ route('fournisseurs.edit', $fournisseur) }}" class="text-yellow-600 hover:underline">Modifier</a>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">Aucun fournisseur trouvé.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $fournisseurs->links() }}
</div>
@endsection

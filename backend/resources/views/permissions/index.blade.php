@extends('layouts.app')

@section('title', 'Permissions')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Permissions</h1>
    <a href="{{ route('permissions.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Permission
    </a>
</div>

<div class="bg-white shadow-md rounded">
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($permissions as $permission)
            <tr>
                <td class="px-6 py-4 font-medium">{{ $permission->name }}</td>
                <td class="px-6 py-4">{{ $permission->description }}</td>
                <td class="px-6 py-4">
                    <a href="{{ route('permissions.edit', $permission) }}" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                    <form action="{{ route('permissions.destroy', $permission) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Are you sure?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $permissions->links() }}
</div>
@endsection

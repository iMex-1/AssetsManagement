@extends('layouts.app')

@section('title', 'Roles')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Roles</h1>
    <a href="{{ route('roles.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Role
    </a>
</div>

<div class="bg-white shadow-md rounded">
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($roles as $role)
            <tr>
                <td class="px-6 py-4 font-medium">{{ $role->name }}</td>
                <td class="px-6 py-4">{{ $role->description }}</td>
                <td class="px-6 py-4">
                    @foreach($role->permissions as $permission)
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{{ $permission->name }}</span>
                    @endforeach
                </td>
                <td class="px-6 py-4">
                    <a href="{{ route('roles.edit', $role) }}" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                    <form action="{{ route('roles.destroy', $role) }}" method="POST" class="inline">
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
    {{ $roles->links() }}
</div>
@endsection

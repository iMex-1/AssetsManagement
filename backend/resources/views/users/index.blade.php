@extends('layouts.app')

@section('title', 'Users')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Users</h1>
    <a href="{{ route('users.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create User
    </a>
</div>

<div class="bg-white shadow-md rounded">
    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            @foreach($users as $user)
            <tr>
                <td class="px-6 py-4">{{ $user->name }}</td>
                <td class="px-6 py-4">{{ $user->email }}</td>
                <td class="px-6 py-4">
                    @foreach($user->roles as $role)
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{{ $role->name }}</span>
                    @endforeach
                </td>
                <td class="px-6 py-4">
                    <a href="{{ route('users.edit', $user) }}" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                    <form action="{{ route('users.destroy', $user) }}" method="POST" class="inline">
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
    {{ $users->links() }}
</div>
@endsection

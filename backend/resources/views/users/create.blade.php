@extends('layouts.app')

@section('title', 'Create User')

@section('content')
<div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Create User</h1>

    <form action="{{ route('users.store') }}" method="POST" class="bg-white shadow-md rounded px-8 pt-6 pb-8">
        @csrf

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" name="name" value="{{ old('name') }}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            @error('name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" value="{{ old('email') }}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            @error('email')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
            @error('password')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input type="password" name="password_confirmation" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
        </div>

        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Roles</label>
            @foreach($roles as $role)
                <label class="inline-flex items-center mr-4">
                    <input type="checkbox" name="roles[]" value="{{ $role->id }}" class="form-checkbox">
                    <span class="ml-2">{{ $role->name }}</span>
                </label>
            @endforeach
        </div>

        <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create User
            </button>
            <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-900">Cancel</a>
        </div>
    </form>
</div>
@endsection

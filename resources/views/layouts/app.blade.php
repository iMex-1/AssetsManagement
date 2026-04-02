<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'RBAC System')</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex space-x-8">
                    <a href="/users" class="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">Users</a>
                    <a href="/roles" class="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">Roles</a>
                    <a href="/permissions" class="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">Permissions</a>
                </div>
                @auth
                <div class="flex items-center">
                    <span class="text-gray-700 mr-4">{{ auth()->user()->name }}</span>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="text-gray-600 hover:text-gray-900">Logout</button>
                    </form>
                </div>
                @endauth
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4">
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>

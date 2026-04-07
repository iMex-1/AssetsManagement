<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'PublicAsset OS') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ config('app.name', 'PublicAsset OS') }}</h1>
            <p class="text-gray-600 mb-8">Asset Management System</p>
            <div class="space-x-4">
                <a href="/users" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Users</a>
                <a href="/roles" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Roles</a>
                <a href="/articles" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Articles</a>
            </div>
        </div>
    </div>
</body>
</html>

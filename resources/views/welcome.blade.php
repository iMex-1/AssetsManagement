<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'PublicAsset OS') }}</title>
    <meta http-equiv="refresh" content="0;url={{ route('login') }}">
</head>
<body>
    <p>Redirecting to <a href="{{ route('login') }}">login</a>...</p>
</body>
</html>

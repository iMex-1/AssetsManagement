<?php

use Illuminate\Support\Facades\Route;

// The React SPA handles all frontend routing.
// These web routes are kept for legacy Blade views only.

Route::get('/', function () {
    return redirect('/articles');
})->name('home');

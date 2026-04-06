<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\FileUploadService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(FileUploadService::class);
    }

    public function boot(): void
    {
        //
    }
}

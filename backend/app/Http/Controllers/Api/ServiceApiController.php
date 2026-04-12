<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceApiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Service::orderBy('nom_service')->get()]);
    }
}

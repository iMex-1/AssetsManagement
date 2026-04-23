<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->string('categorie'); // Materiel ou Fourniture
            $table->integer('stock_actuel')->default(0); // Updated automatically
            $table->integer('seuil_alerte')->default(0); // For low-stock alerts
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

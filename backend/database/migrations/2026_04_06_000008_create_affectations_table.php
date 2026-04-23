<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->integer('quantite_affectee');
            $table->string('cible')->nullable(); // ex: Matricule Vehicule, Poteau X, Bureau
            $table->string('coordonnees_gps')->nullable(); // Pour eclairage
            $table->string('photo_jointe')->nullable(); // Preuve d'installation
            $table->date('date_action');
            $table->enum('etat', ['en_service', 'en_panne', 'en_reparation', 'hors_service'])->default('en_service');
            $table->date('date_fin')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};

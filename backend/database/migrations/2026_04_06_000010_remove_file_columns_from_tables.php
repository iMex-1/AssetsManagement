<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->dropColumn('bon_scanne');
        });

        Schema::table('affectations', function (Blueprint $table) {
            $table->dropColumn('photo_jointe');
        });
    }

    public function down(): void
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->string('bon_scanne')->nullable();
        });

        Schema::table('affectations', function (Blueprint $table) {
            $table->string('photo_jointe')->nullable();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('riders', function (Blueprint $table) {
            $table->id('id_rider');
            $table->string('nama_rider', 100);
            $table->string('foto_rider', 255)->nullable();
            $table->string('no_hp', 20);
            $table->string('username', 50)->unique();
            $table->string('password', 255);
            $table->enum('status_akun', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->enum('status_jualan', ['Tersedia', 'Habis'])->default('Tersedia');
            $table->enum('status_live_location', ['Aktif', 'Nonaktif'])->default('Nonaktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riders');
    }
};

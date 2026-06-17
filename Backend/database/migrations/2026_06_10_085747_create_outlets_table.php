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
        Schema::create('outlets', function (Blueprint $table) {
            $table->id('id_outlet');
            $table->unsignedBigInteger('id_admin');
            $table->unsignedBigInteger('id_rider')->nullable();
            $table->string('nama_outlet', 100);
            $table->enum('jenis_outlet', ['Outlet Tetap', 'Outlet Bergerak']);
            $table->string('link_lokasi', 255)->nullable();
            $table->text('keterangan_lokasi')->nullable();
            $table->enum('status_operasional', ['Buka', 'Tutup'])->default('Buka');
            $table->timestamps();

            $table->foreign('id_admin')->references('id_admin')->on('admins')->onDelete('cascade');
            $table->foreign('id_rider')->references('id_rider')->on('riders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outlets');
    }
};

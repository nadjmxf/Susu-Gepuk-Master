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
        Schema::create('menus', function (Blueprint $table) {
            $table->id('id_menu');
            $table->unsignedBigInteger('id_admin');
            $table->string('nama_menu', 100);
            $table->integer('harga');
            $table->text('deskripsi')->nullable();
            $table->string('gambar_menu', 255)->nullable();
            $table->enum('kategori_menu', ['Outlet', 'SOTR', 'Keduanya']);
            $table->enum('tag_menu', ['New', 'Best Seller'])->nullable();
            $table->date('tanggal_tag_new')->nullable();
            $table->enum('status_menu', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->timestamps();

            $table->foreign('id_admin')->references('id_admin')->on('admins')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};

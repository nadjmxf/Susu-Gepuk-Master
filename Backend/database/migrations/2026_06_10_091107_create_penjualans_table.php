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
        Schema::create('penjualans', function (Blueprint $table) {
            $table->id('id_penjualan');
            $table->unsignedBigInteger('id_rider');
            $table->date('tanggal_penjualan');
            $table->integer('jumlah_susu_basi')->default(0);
            $table->integer('jumlah_susu_rusak')->default(0);
            $table->integer('sisa_stok')->default(0);
            $table->integer('setoran_cash')->default(0);
            $table->integer('setoran_qris')->default(0);
            $table->string('bukti_transfer', 255)->nullable();
            $table->integer('total_pendapatan');
            $table->integer('jumlah_produk_terjual');
            $table->timestamps();

            $table->foreign('id_rider')->references('id_rider')->on('riders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualans');
    }
};

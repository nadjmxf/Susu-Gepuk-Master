<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    protected $primaryKey = 'id_penjualan';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'id_rider',
        'tanggal_penjualan',
        'jumlah_susu_basi',
        'jumlah_susu_rusak',
        'sisa_stok',
        'setoran_cash',
        'setoran_qris',
        'bukti_transfer',
        'total_pendapatan',
        'jumlah_produk_terjual',
    ];
}

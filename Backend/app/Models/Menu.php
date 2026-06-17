<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $primaryKey = 'id_menu';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'id_admin',
        'nama_menu',
        'harga',
        'stok_bawa',
        'deskripsi',
        'gambar_menu',
        'kategori_menu',
        'tag_menu',
        'tanggal_tag_new',
        'status_menu',
    ];
}

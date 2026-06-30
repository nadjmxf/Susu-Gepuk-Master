<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rider extends Model
{
    protected $primaryKey = 'id_rider';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'nama_rider',
        'area',
        'current_location',
        'foto_rider',
        'no_hp',
        'username',
        'password',
        'status_akun',
        'status_jualan',
        'status_live_location',
    ];

    public function aktivitas()
    {
        return $this->hasMany(Aktivitas::class, 'id_rider', 'id_rider');
    }

    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'id_rider', 'id_rider');
    }
}

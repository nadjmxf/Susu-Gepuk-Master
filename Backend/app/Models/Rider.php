<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Rider extends Authenticatable
{
    use HasApiTokens;

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

    protected $hidden = [
        'password',
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


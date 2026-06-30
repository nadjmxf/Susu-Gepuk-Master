<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Outlet extends Model
{
    protected $primaryKey = 'id_outlet';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'id_admin',
        'id_rider',
        'nama_outlet',
        'area',
        'jenis_outlet',
        'link_lokasi',
        'keterangan_lokasi',
        'status_operasional',
        'latitude',
        'longitude',
    ];

    public function rider()
    {
        return $this->belongsTo(Rider::class, 'id_rider');
    }
}

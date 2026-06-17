<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    protected $primaryKey = 'id_lokasi';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'id_rider',
        'latitude',
        'longitude',
        'waktu_update',
    ];
}

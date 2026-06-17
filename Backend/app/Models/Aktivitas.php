<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aktivitas extends Model
{
    protected $primaryKey = 'id_aktivitas';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = [
        'id_rider',
        'tanggal_aktivitas',
        'status_aktivitas',
        'keterangan',
        'created_at',
    ];
}

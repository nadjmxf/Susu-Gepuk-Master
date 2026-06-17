<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $primaryKey = 'id_announcement';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = [
        'id_admin',
        'judul',
        'isi',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
        'created_at',
    ];
}

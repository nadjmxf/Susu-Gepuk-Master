<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AktivitasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Aktivitas::create([
            'id_rider' => 1,
            'tanggal_aktivitas' => '2026-06-10',
            'status_aktivitas' => 'Berjualan',
            'keterangan' => 'Berjualan di Jalan Merdeka',
            'created_at' => now(),
        ]);

        \App\Models\Aktivitas::create([
            'id_rider' => 1,
            'tanggal_aktivitas' => '2026-06-09',
            'status_aktivitas' => 'Izin',
            'keterangan' => 'Izin untuk menghadiri acara keluarga',
            'created_at' => now(),
        ]);

        \App\Models\Aktivitas::create([
            'id_rider' => 1,
            'tanggal_aktivitas' => '2026-06-08',
            'status_aktivitas' => 'Sakit',
            'keterangan' => 'Sakit demam tinggi',
            'created_at' => now(),
        ]);
    }
}

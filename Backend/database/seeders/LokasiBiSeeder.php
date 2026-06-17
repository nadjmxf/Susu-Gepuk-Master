<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LokasiBiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Lokasi::create([
            'id_rider' => 1,
            'latitude' => -6.20000000,
            'longitude' => 106.80000000,
            'waktu_update' => now(),
        ]);

        \App\Models\Lokasi::create([
            'id_rider' => 1,
            'latitude' => -6.21500000,
            'longitude' => 106.81500000,
            'waktu_update' => now()->subMinutes(15),
        ]);

        \App\Models\Lokasi::create([
            'id_rider' => 1,
            'latitude' => -6.22000000,
            'longitude' => 106.82000000,
            'waktu_update' => now()->subMinutes(30),
        ]);
    }
}

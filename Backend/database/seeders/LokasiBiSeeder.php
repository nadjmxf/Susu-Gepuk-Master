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
        // Rider 1
        \App\Models\Lokasi::create([
            'id_rider' => 1,
            'latitude' => 0.50740000,
            'longitude' => 101.44780000,
            'waktu_update' => now(),
        ]);

        // Rider 2
        \App\Models\Lokasi::create([
            'id_rider' => 2,
            'latitude' => 0.47280000,
            'longitude' => 101.37890000,
            'waktu_update' => now(),
        ]);

        // Rider 3
        \App\Models\Lokasi::create([
            'id_rider' => 3,
            'latitude' => 0.48500000,
            'longitude' => 101.42500000,
            'waktu_update' => now(),
        ]);

        // Rider 4
        \App\Models\Lokasi::create([
            'id_rider' => 4,
            'latitude' => 0.49500000,
            'longitude' => 101.46500000,
            'waktu_update' => now(),
        ]);

        // Rider 5
        \App\Models\Lokasi::create([
            'id_rider' => 5,
            'latitude' => 0.44200000,
            'longitude' => 101.42200000,
            'waktu_update' => now(),
        ]);

        // Rider 6
        \App\Models\Lokasi::create([
            'id_rider' => 6,
            'latitude' => 0.46800000,
            'longitude' => 101.36500000,
            'waktu_update' => now(),
        ]);
    }
}

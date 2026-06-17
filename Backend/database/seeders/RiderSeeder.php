<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RiderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Rider 1 - Marpoyan - Simpang Tiga
        \App\Models\Rider::create([
            'nama_rider' => 'Budi Santoso',
            'area' => 'Marpoyan - Simpang Tiga',
            'current_location' => 'Jl. Sudirman (Dekat Bundaran)',
            'foto_rider' => 'riders/budi.jpg',
            'no_hp' => '081234567890',
            'username' => 'budi_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Tersedia',
            'status_live_location' => 'Nonaktif',
        ]);

        // Rider 2 - Panam
        \App\Models\Rider::create([
            'nama_rider' => 'Ahmad Pratama',
            'area' => 'Panam',
            'current_location' => 'Jl. HR Soebrantas',
            'foto_rider' => 'riders/ahmad.jpg',
            'no_hp' => '081234567891',
            'username' => 'ahmad_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Tersedia',
            'status_live_location' => 'Nonaktif',
        ]);

        // Rider 3 - Arifin Ahmad
        \App\Models\Rider::create([
            'nama_rider' => 'Reza Wijaya',
            'area' => 'Arifin Ahmad',
            'current_location' => 'Jl. Arifin Ahmad',
            'foto_rider' => 'riders/reza.jpg',
            'no_hp' => '081234567892',
            'username' => 'reza_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Habis',
            'status_live_location' => 'Nonaktif',
        ]);

        // Rider 4 - Harapan Raya
        \App\Models\Rider::create([
            'nama_rider' => 'Eko Suryanto',
            'area' => 'Harapan Raya',
            'current_location' => 'Jl. Harapan Raya',
            'foto_rider' => 'riders/eko.jpg',
            'no_hp' => '081234567893',
            'username' => 'eko_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Tersedia',
            'status_live_location' => 'Nonaktif',
        ]);

        // Rider 5 - Kartama - Inpres
        \App\Models\Rider::create([
            'nama_rider' => 'Doni Hermawan',
            'area' => 'Kartama - Inpres',
            'current_location' => 'Jl. Kartama',
            'foto_rider' => 'riders/doni.jpg',
            'no_hp' => '081234567894',
            'username' => 'doni_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Habis',
            'status_live_location' => 'Nonaktif',
        ]);

        // Rider 6 - Panam
        \App\Models\Rider::create([
            'nama_rider' => 'Guna Mandala',
            'area' => 'Panam',
            'current_location' => 'Simpang Panam',
            'foto_rider' => 'riders/guna.jpg',
            'no_hp' => '081234567895',
            'username' => 'guna_rider',
            'password' => bcrypt('password123'),
            'status_akun' => 'Aktif',
            'status_jualan' => 'Tersedia',
            'status_live_location' => 'Nonaktif',
        ]);
    }
}

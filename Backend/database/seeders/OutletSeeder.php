<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Area Marpoyan
        \App\Models\Outlet::create([
            'id_admin' => 1,
            'id_rider' => null,
            'nama_outlet' => 'Jalan Air Dingin No.17 Dekat Kampus UIR',
            'area' => 'Marpoyan',
            'jenis_outlet' => 'Outlet Tetap',
            'link_lokasi' => 'https://maps.app.goo.gl/BYfh2QSe9gRcPDh18',
            'keterangan_lokasi' => '08:00 - 22:00',
            'status_operasional' => 'Buka',
        ]);

        \App\Models\Outlet::create([
            'id_admin' => 1,
            'id_rider' => null,
            'nama_outlet' => 'Jalan Karya 1 Dekat Kampus UIR',
            'area' => 'Marpoyan',
            'jenis_outlet' => 'Outlet Tetap',
            'link_lokasi' => 'https://goo.gl/maps/qfEfed8L1tVZtF4A7',
            'keterangan_lokasi' => '08:00 - 22:00',
            'status_operasional' => 'Buka',
        ]);

        // Area Panam
        \App\Models\Outlet::create([
            'id_admin' => 1,
            'id_rider' => null,
            'nama_outlet' => 'Jalan Manyarsakti No.57 Dekat Kampus UNRI',
            'area' => 'Panam',
            'jenis_outlet' => 'Outlet Tetap',
            'link_lokasi' => 'https://maps.app.goo.gl/o7eUF5xgNvxnRmh79',
            'keterangan_lokasi' => '09:00 - 22:00',
            'status_operasional' => 'Buka',
        ]);

        \App\Models\Outlet::create([
            'id_admin' => 1,
            'id_rider' => null,
            'nama_outlet' => 'Jalan Baraq Dekat Kampus UNRI',
            'area' => 'Panam',
            'jenis_outlet' => 'Outlet Tetap',
            'link_lokasi' => 'https://maps.app.goo.gl/AtT4btqASm7N1ng68',
            'keterangan_lokasi' => '09:00 - 22:00',
            'status_operasional' => 'Tutup',
        ]);

        // Area Pandau Permai
        \App\Models\Outlet::create([
            'id_admin' => 1,
            'id_rider' => null,
            'nama_outlet' => 'Jalan Gading Marpoyan Pandau Permai',
            'area' => 'Pandau Permai',
            'jenis_outlet' => 'Outlet Tetap',
            'link_lokasi' => 'https://maps.app.goo.gl/XJzevuAVPoscnF8N6',
            'keterangan_lokasi' => '09:00 - 22:00',
            'status_operasional' => 'Buka',
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Announcement::create([
            'id_admin' => 1,
            'judul' => 'Promo Spesial Musim Panas',
            'isi' => 'Dapatkan diskon 20% untuk semua menu minuman selama bulan Juni ini. Hanya berlaku untuk pembelian minimal 3 item. Jangan lewatkan kesempatan emas ini!',
            'status' => 'Aktif',
            'tanggal_mulai' => '2026-06-01',
            'tanggal_selesai' => '2026-06-30',
            'created_at' => now(),
        ]);

        \App\Models\Announcement::create([
            'id_admin' => 1,
            'judul' => 'Pemeliharaan Sistem',
            'isi' => 'Sistem akan melakukan pemeliharaan rutin pada tanggal 15 Juni mulai pukul 23:00 hingga 03:00 waktu setempat. Mohon maaf atas gangguan yang mungkin terjadi.',
            'status' => 'Aktif',
            'tanggal_mulai' => '2026-06-14',
            'tanggal_selesai' => '2026-06-15',
            'created_at' => now(),
        ]);

        \App\Models\Announcement::create([
            'id_admin' => 1,
            'judul' => 'Peluncuran Menu Baru',
            'isi' => 'Kami dengan bangga mempersembahkan menu terbaru: Susu Avocado Latte dan Susu Taro Premium. Tersedia mulai tanggal 20 Juni di semua outlet Susu Gepuk.',
            'status' => 'Aktif',
            'tanggal_mulai' => '2026-06-18',
            'tanggal_selesai' => null,
            'created_at' => now(),
        ]);
    }
}

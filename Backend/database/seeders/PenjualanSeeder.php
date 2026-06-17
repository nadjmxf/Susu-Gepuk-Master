<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenjualanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $riderId = 1;
        
        // Create 30 penjualan records for pagination testing
        $penjualanData = [
            ['date' => '2026-06-10', 'terjual' => 25, 'basi' => 2, 'rusak' => 1, 'sisa' => 15, 'cash' => 250000, 'qris' => 150000],
            ['date' => '2026-06-09', 'terjual' => 22, 'basi' => 1, 'rusak' => 0, 'sisa' => 12, 'cash' => 200000, 'qris' => 180000],
            ['date' => '2026-06-08', 'terjual' => 30, 'basi' => 3, 'rusak' => 2, 'sisa' => 18, 'cash' => 300000, 'qris' => 200000],
            ['date' => '2026-06-07', 'terjual' => 28, 'basi' => 2, 'rusak' => 1, 'sisa' => 16, 'cash' => 280000, 'qris' => 170000],
            ['date' => '2026-06-06', 'terjual' => 20, 'basi' => 1, 'rusak' => 0, 'sisa' => 14, 'cash' => 200000, 'qris' => 150000],
            ['date' => '2026-06-05', 'terjual' => 35, 'basi' => 4, 'rusak' => 2, 'sisa' => 20, 'cash' => 350000, 'qris' => 250000],
            ['date' => '2026-06-04', 'terjual' => 26, 'basi' => 2, 'rusak' => 1, 'sisa' => 15, 'cash' => 260000, 'qris' => 140000],
            ['date' => '2026-06-03', 'terjual' => 32, 'basi' => 3, 'rusak' => 2, 'sisa' => 18, 'cash' => 320000, 'qris' => 180000],
            ['date' => '2026-06-02', 'terjual' => 24, 'basi' => 1, 'rusak' => 1, 'sisa' => 13, 'cash' => 240000, 'qris' => 160000],
            ['date' => '2026-06-01', 'terjual' => 29, 'basi' => 2, 'rusak' => 0, 'sisa' => 17, 'cash' => 290000, 'qris' => 200000],
            ['date' => '2026-05-31', 'terjual' => 27, 'basi' => 2, 'rusak' => 2, 'sisa' => 16, 'cash' => 270000, 'qris' => 130000],
            ['date' => '2026-05-30', 'terjual' => 31, 'basi' => 3, 'rusak' => 1, 'sisa' => 19, 'cash' => 310000, 'qris' => 190000],
            ['date' => '2026-05-29', 'terjual' => 23, 'basi' => 1, 'rusak' => 0, 'sisa' => 12, 'cash' => 230000, 'qris' => 170000],
            ['date' => '2026-05-28', 'terjual' => 36, 'basi' => 4, 'rusak' => 3, 'sisa' => 21, 'cash' => 360000, 'qris' => 260000],
            ['date' => '2026-05-27', 'terjual' => 25, 'basi' => 2, 'rusak' => 1, 'sisa' => 14, 'cash' => 250000, 'qris' => 150000],
            ['date' => '2026-05-26', 'terjual' => 30, 'basi' => 2, 'rusak' => 2, 'sisa' => 17, 'cash' => 300000, 'qris' => 200000],
            ['date' => '2026-05-25', 'terjual' => 28, 'basi' => 3, 'rusak' => 1, 'sisa' => 15, 'cash' => 280000, 'qris' => 160000],
            ['date' => '2026-05-24', 'terjual' => 22, 'basi' => 1, 'rusak' => 0, 'sisa' => 11, 'cash' => 220000, 'qris' => 140000],
            ['date' => '2026-05-23', 'terjual' => 33, 'basi' => 3, 'rusak' => 2, 'sisa' => 19, 'cash' => 330000, 'qris' => 210000],
            ['date' => '2026-05-22', 'terjual' => 26, 'basi' => 2, 'rusak' => 1, 'sisa' => 15, 'cash' => 260000, 'qris' => 180000],
            ['date' => '2026-05-21', 'terjual' => 29, 'basi' => 2, 'rusak' => 0, 'sisa' => 18, 'cash' => 290000, 'qris' => 170000],
            ['date' => '2026-05-20', 'terjual' => 34, 'basi' => 4, 'rusak' => 2, 'sisa' => 20, 'cash' => 340000, 'qris' => 220000],
            ['date' => '2026-05-19', 'terjual' => 24, 'basi' => 1, 'rusak' => 1, 'sisa' => 13, 'cash' => 240000, 'qris' => 160000],
            ['date' => '2026-05-18', 'terjual' => 31, 'basi' => 3, 'rusak' => 2, 'sisa' => 18, 'cash' => 310000, 'qris' => 190000],
            ['date' => '2026-05-17', 'terjual' => 27, 'basi' => 2, 'rusak' => 1, 'sisa' => 16, 'cash' => 270000, 'qris' => 150000],
            ['date' => '2026-05-16', 'terjual' => 37, 'basi' => 4, 'rusak' => 3, 'sisa' => 22, 'cash' => 370000, 'qris' => 270000],
            ['date' => '2026-05-15', 'terjual' => 25, 'basi' => 2, 'rusak' => 0, 'sisa' => 14, 'cash' => 250000, 'qris' => 140000],
            ['date' => '2026-05-14', 'terjual' => 28, 'basi' => 1, 'rusak' => 1, 'sisa' => 16, 'cash' => 280000, 'qris' => 180000],
            ['date' => '2026-05-13', 'terjual' => 32, 'basi' => 3, 'rusak' => 2, 'sisa' => 19, 'cash' => 320000, 'qris' => 200000],
            ['date' => '2026-05-12', 'terjual' => 26, 'basi' => 2, 'rusak' => 1, 'sisa' => 15, 'cash' => 260000, 'qris' => 160000],
        ];

        foreach ($penjualanData as $data) {
            \App\Models\Penjualan::create([
                'id_rider' => $riderId,
                'tanggal_penjualan' => $data['date'],
                'jumlah_produk_terjual' => $data['terjual'],
                'jumlah_susu_basi' => $data['basi'],
                'jumlah_susu_rusak' => $data['rusak'],
                'sisa_stok' => $data['sisa'],
                'setoran_cash' => $data['cash'],
                'setoran_qris' => $data['qris'],
                'bukti_transfer' => rand(0, 1) ? 'transfers/bukti-qris-' . date('Ymd', strtotime($data['date'])) . '.jpg' : null,
                'total_pendapatan' => $data['cash'] + $data['qris'],
            ]);
        }
    }
}

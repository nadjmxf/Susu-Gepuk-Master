<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Melon Frost',
            'harga' => 15000,
            'stok_bawa' => 20,
            'deskripsi' => 'Susu sapi segar dengan rasa melon yang menyegarkan',
            'gambar_menu' => 'Susu Melon Frost-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => 'Best Seller',
            'tanggal_tag_new' => null,
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Coklat Swiz',
            'harga' => 15000,
            'stok_bawa' => 20,
            'deskripsi' => 'Susu sapi dengan rasa coklat yang lezat dan nikmat',
            'gambar_menu' => 'Susu Coklat Swiz-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => null,
            'tanggal_tag_new' => null,
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Kopi',
            'harga' => 15000,
            'stok_bawa' => 20,
            'deskripsi' => 'Perpaduan sempurna antara susu sapi segar dan kopi premium',
            'gambar_menu' => 'Susu Kopi-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => null,
            'tanggal_tag_new' => null,
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Matcha Kyoto',
            'harga' => 15000,
            'stok_bawa' => 20,
            'deskripsi' => 'Susu sapi dengan rasa matcha autentik dari Jepang',
            'gambar_menu' => 'Susu Matcha Kyoto-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => null,
            'tanggal_tag_new' => null,
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Murni Botol',
            'harga' => 10000,
            'stok_bawa' => 20,
            'deskripsi' => '100% susu sapi murni tanpa tambahan apapun dalam kemasan botol',
            'gambar_menu' => 'Susu Murni Botol-Photoroom.png',
            'kategori_menu' => 'Outlet',
            'tag_menu' => null,
            'tanggal_tag_new' => null,
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Strawberry',
            'harga' => 10000,
            'stok_bawa' => 20,
            'deskripsi' => 'Susu sapi dengan rasa strawberry yang manis dan segar',
            'gambar_menu' => 'Susu Strawberry-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => 'New',
            'tanggal_tag_new' => now()->toDateString(),
            'status_menu' => 'Aktif',
        ]);

        \App\Models\Menu::create([
            'id_admin' => 1,
            'nama_menu' => 'Susu Vanilla Sweet',
            'harga' => 10000,
            'stok_bawa' => 20,
            'deskripsi' => 'Susu sapi dengan rasa vanilla yang lembut dan menenangkan',
            'gambar_menu' => 'Susu Vanilla Sweet-Photoroom.png',
            'kategori_menu' => 'Keduanya',
            'tag_menu' => 'New',
            'tanggal_tag_new' => now()->toDateString(),
            'status_menu' => 'Aktif',
        ]);
    }
}

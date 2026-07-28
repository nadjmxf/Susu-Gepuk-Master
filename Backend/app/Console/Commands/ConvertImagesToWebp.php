<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ImageHelper;
use App\Models\Rider;
use App\Models\Menu;
use App\Models\Announcement;
use App\Models\Penjualan;

class ConvertImagesToWebp extends Command
{
    protected $signature = 'images:convert-webp';
    protected $description = 'Convert all existing PNG/JPG/JPEG images in storage to WebP format and update database paths';

    public function handle()
    {
        $this->info('========================================');
        $this->info('  KONVERSI GAMBAR KE WEBP');
        $this->info('========================================');
        $this->newLine();

        $totalConverted = 0;
        $totalSkipped = 0;
        $totalFailed = 0;
        $failedDetails = [];

        // ─── 1. RIDERS ──────────────────────────────────
        $this->info('📸 Processing RIDERS...');
        $riders = Rider::whereNotNull('foto_rider')->where('foto_rider', '!=', '')->get();
        $bar = $this->output->createProgressBar($riders->count());
        $bar->start();

        foreach ($riders as $rider) {
            $newPath = ImageHelper::convertExistingToWebp($rider->foto_rider);
            if ($newPath) {
                $rider->update(['foto_rider' => $newPath]);
                $totalConverted++;
            } elseif (strtolower(pathinfo($rider->foto_rider, PATHINFO_EXTENSION)) === 'webp') {
                $totalSkipped++;
            } else {
                $totalFailed++;
                $fullPath = Storage::disk('public')->path($rider->foto_rider);
                $failedDetails[] = "RIDER #{$rider->id_rider}: {$rider->foto_rider} (exists=" . (file_exists($fullPath) ? 'YES' : 'NO') . ")";
            }
            $bar->advance();
        }
        $bar->finish();
        $this->newLine(2);

        // ─── 2. MENUS ──────────────────────────────────
        $this->info('🍽️  Processing MENUS...');
        $menus = Menu::whereNotNull('gambar_menu')->where('gambar_menu', '!=', '')->get();
        $bar = $this->output->createProgressBar($menus->count());
        $bar->start();

        foreach ($menus as $menu) {
            $newPath = ImageHelper::convertExistingToWebp($menu->gambar_menu);
            if ($newPath) {
                $menu->update(['gambar_menu' => $newPath]);
                $totalConverted++;
            } elseif (strtolower(pathinfo($menu->gambar_menu, PATHINFO_EXTENSION)) === 'webp') {
                $totalSkipped++;
            } else {
                $totalFailed++;
                $fullPath = Storage::disk('public')->path($menu->gambar_menu);
                $failedDetails[] = "MENU #{$menu->id_menu}: {$menu->gambar_menu} (exists=" . (file_exists($fullPath) ? 'YES' : 'NO') . ")";
            }
            $bar->advance();
        }
        $bar->finish();
        $this->newLine(2);

        // ─── 3. ANNOUNCEMENTS ──────────────────────────
        $this->info('📢 Processing ANNOUNCEMENTS...');
        $announcements = Announcement::whereNotNull('gambar_announcement')->where('gambar_announcement', '!=', '')->get();
        $bar = $this->output->createProgressBar($announcements->count());
        $bar->start();

        foreach ($announcements as $announcement) {
            $newPath = ImageHelper::convertExistingToWebp($announcement->gambar_announcement);
            if ($newPath) {
                $announcement->update(['gambar_announcement' => $newPath]);
                $totalConverted++;
            } elseif (strtolower(pathinfo($announcement->gambar_announcement, PATHINFO_EXTENSION)) === 'webp') {
                $totalSkipped++;
            } else {
                $totalFailed++;
                $fullPath = Storage::disk('public')->path($announcement->gambar_announcement);
                $failedDetails[] = "ANN #{$announcement->id_announcement}: {$announcement->gambar_announcement} (exists=" . (file_exists($fullPath) ? 'YES' : 'NO') . ")";
            }
            $bar->advance();
        }
        $bar->finish();
        $this->newLine(2);

        // ─── 4. PENJUALAN (BUKTI TRANSFER) ─────────────
        $this->info('💰 Processing BUKTI TRANSFER...');
        $penjualans = Penjualan::whereNotNull('bukti_transfer')->where('bukti_transfer', '!=', '')->get();
        $bar = $this->output->createProgressBar($penjualans->count());
        $bar->start();

        foreach ($penjualans as $penjualan) {
            $newPath = ImageHelper::convertExistingToWebp($penjualan->bukti_transfer);
            if ($newPath) {
                $penjualan->update(['bukti_transfer' => $newPath]);
                $totalConverted++;
            } elseif (strtolower(pathinfo($penjualan->bukti_transfer, PATHINFO_EXTENSION)) === 'webp') {
                $totalSkipped++;
            } else {
                $totalFailed++;
                $fullPath = Storage::disk('public')->path($penjualan->bukti_transfer);
                $failedDetails[] = "PENJUALAN #{$penjualan->id_penjualan}: {$penjualan->bukti_transfer} (exists=" . (file_exists($fullPath) ? 'YES' : 'NO') . ")";
            }
            $bar->advance();
        }
        $bar->finish();
        $this->newLine(2);

        // ─── SUMMARY ───────────────────────────────────
        $this->info('========================================');
        $this->info('  HASIL KONVERSI');
        $this->info('========================================');
        $this->info("✅ Berhasil dikonversi : {$totalConverted}");
        $this->info("⏭️  Sudah WebP (skip)   : {$totalSkipped}");
        if ($totalFailed > 0) {
            $this->warn("❌ Gagal konversi      : {$totalFailed}");
            $this->newLine();
            $this->warn('Detail gagal:');
            foreach ($failedDetails as $detail) {
                $this->line("  → {$detail}");
            }
        }
        $this->newLine();
        $this->info('🎉 Selesai!');

        return Command::SUCCESS;
    }
}

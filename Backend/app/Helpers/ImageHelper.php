<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Encoders\WebpEncoder;

class ImageHelper
{
    /**
     * Convert an uploaded image to WebP format and store it.
     *
     * @param UploadedFile $file The uploaded image file
     * @param string $folder The storage subfolder (e.g. 'riders', 'menus')
     * @param int $quality WebP quality (0-100)
     * @return string The storage path (e.g. 'riders/1234567890.webp')
     */
    public static function convertToWebp(UploadedFile $file, string $folder, int $quality = 80): string
    {
        $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());

        // Read the uploaded image
        $image = $manager->decode(file_get_contents($file->getRealPath()));

        // Generate unique filename with .webp extension
        $fileName = time() . '_' . pathinfo(
            preg_replace('/[^A-Za-z0-9_.-]/', '', $file->getClientOriginalName()),
            PATHINFO_FILENAME
        ) . '.webp';

        // Encode to WebP
        $encoded = $image->encode(new WebpEncoder(quality: $quality));

        // Store to public disk
        $path = $folder . '/' . $fileName;
        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }

    /**
     * Convert an existing image file in storage to WebP format.
     *
     * @param string $currentPath Current storage path (e.g. 'riders/photo.png')
     * @param int $quality WebP quality (0-100)
     * @return string|null New WebP path, or null if conversion failed
     */
    public static function convertExistingToWebp(string $currentPath, int $quality = 80): ?string
    {
        // Skip if already WebP
        if (strtolower(pathinfo($currentPath, PATHINFO_EXTENSION)) === 'webp') {
            return null;
        }

        $fullPath = Storage::disk('public')->path($currentPath);

        if (!file_exists($fullPath)) {
            return null;
        }

        try {
            $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->decode(file_get_contents($fullPath));

            // New filename with .webp extension
            $newPath = pathinfo($currentPath, PATHINFO_DIRNAME) . '/'
                     . pathinfo($currentPath, PATHINFO_FILENAME) . '.webp';

            // Encode and save
            $encoded = $image->encode(new WebpEncoder(quality: $quality));
            Storage::disk('public')->put($newPath, (string) $encoded);

            // Delete original file
            Storage::disk('public')->delete($currentPath);

            return $newPath;
        } catch (\Exception $e) {
            \Log::warning("WebP conversion failed for {$currentPath}: " . $e->getMessage());
            return null;
        }
    }
}

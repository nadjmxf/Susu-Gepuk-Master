<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Rider;
use App\Models\Lokasi;

class LokasiBiController extends Controller
{
    public function index()
    {
        $riders = Rider::where('status_akun', 'Aktif')->get();
        
        $sotrLocations = $riders->map(function ($rider) {
            $latestLocation = Lokasi::where('id_rider', $rider->id_rider)
                ->orderBy('waktu_update', 'desc')
                ->first();
                
            return [
                'id' => $rider->id_rider,
                'name' => $rider->nama_rider,
                'status_jualan' => $rider->status_jualan,
                'status_live_location' => $rider->status_live_location,
                'latitude' => $latestLocation ? floatval($latestLocation->latitude) : 0.5074,
                'longitude' => $latestLocation ? floatval($latestLocation->longitude) : 101.4478,
                'waktu_update' => $latestLocation ? $latestLocation->waktu_update : null,
                'desc' => 'Status: ' . ($rider->status_jualan === 'Tersedia' ? 'Berjualan' : 'Standby / Habis'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $sotrLocations,
        ]);
    }
}

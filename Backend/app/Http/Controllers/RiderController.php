<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rider;
use App\Models\Lokasi;

class RiderController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Rider::all(),
        ]);
    }

    public function show($id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rider,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_rider' => 'required|string',
            'no_hp' => 'required|string',
            'username' => 'required|unique:riders',
            'password' => 'required|min:6',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        
        $rider = Rider::create($validated);

        return response()->json([
            'success' => true,
            'data' => $rider,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'nama_rider' => 'string',
            'no_hp' => 'string',
            'status_akun' => 'in:Aktif,Nonaktif',
            'status_jualan' => 'in:Tersedia,Habis',
            'status_live_location' => 'in:Aktif,Nonaktif',
        ]);

        $rider->update($validated);

        return response()->json([
            'success' => true,
            'data' => $rider,
        ]);
    }

    public function destroy($id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        $rider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rider berhasil dihapus',
        ]);
    }

    public function getLocation($id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        // Get latest location from lokasi table
        $lastLocation = Lokasi::where('id_rider', $id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id_rider' => $rider->id_rider,
                'status_live_location' => $rider->status_live_location,
                'latitude' => $lastLocation ? $lastLocation->latitude : -6.2088,
                'longitude' => $lastLocation ? $lastLocation->longitude : 106.8456,
                'waktu_update' => $lastLocation ? $lastLocation->waktu_update : null,
                'alamat' => $lastLocation ? $lastLocation->alamat ?? 'Lokasi tidak tersedia' : 'Jl. Jend. Sudirman Kav. 1, Jakarta Pusat',
            ],
        ]);
    }

    public function updateLocation(Request $request, $id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'status_live_location' => 'required|in:Aktif,Nonaktif',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // Update rider status
        $rider->update(['status_live_location' => $validated['status_live_location']]);

        // If Aktif and coordinates provided, save location to lokasi table
        if ($validated['status_live_location'] === 'Aktif' && $validated['latitude'] && $validated['longitude']) {
            Lokasi::create([
                'id_rider' => $id,
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'waktu_update' => now(),
            ]);
        }

        // Refresh rider object to get updated data
        $rider->refresh();

        return response()->json([
            'success' => true,
            'data' => $rider,
            'message' => 'Lokasi berhasil diperbarui',
        ]);
    }

    public function getActivity($id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rider->aktivitas ?? [],
        ]);
    }

    public function storeActivity(Request $request, $id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Aktivitas berhasil dicatat',
        ]);
    }
}

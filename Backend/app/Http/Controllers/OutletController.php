<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Outlet;

class OutletController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Outlet::with('rider')->get(),
        ]);
    }

    public function show($id)
    {
        $outlet = Outlet::with('rider')->find($id);
        
        if (!$outlet) {
            return response()->json([
                'success' => false,
                'message' => 'Outlet tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $outlet,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_admin' => 'required|exists:admins,id_admin',
            'id_rider' => 'nullable|exists:riders,id_rider',
            'nama_outlet' => 'required|string|max:100',
            'area' => 'required|string|max:100',
            'jenis_outlet' => 'required|in:Outlet Tetap,Outlet Bergerak',
            'link_lokasi' => 'nullable|string|max:255',
            'keterangan_lokasi' => 'nullable|string',
            'status_operasional' => 'required|in:Buka,Tutup',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $outlet = Outlet::create($validated);
        
        // Load relation for response
        $outlet->load('rider');

        return response()->json([
            'success' => true,
            'data' => $outlet,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $outlet = Outlet::find($id);
        
        if (!$outlet) {
            return response()->json([
                'success' => false,
                'message' => 'Outlet tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'id_rider' => 'nullable|exists:riders,id_rider',
            'nama_outlet' => 'string|max:100',
            'area' => 'string|max:100',
            'jenis_outlet' => 'in:Outlet Tetap,Outlet Bergerak',
            'link_lokasi' => 'nullable|string|max:255',
            'keterangan_lokasi' => 'nullable|string',
            'status_operasional' => 'in:Buka,Tutup',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $outlet->update($validated);
        
        // Load relation for response
        $outlet->load('rider');

        return response()->json([
            'success' => true,
            'data' => $outlet,
        ]);
    }

    public function destroy($id)
    {
        $outlet = Outlet::find($id);
        
        if (!$outlet) {
            return response()->json([
                'success' => false,
                'message' => 'Outlet tidak ditemukan',
            ], 404);
        }

        $outlet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Outlet berhasil dihapus',
        ]);
    }
}

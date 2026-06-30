<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Announcement::all(),
        ]);
    }

    public function show($id)
    {
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $announcement,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_admin' => 'required|integer',
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'status' => 'required|in:Aktif,Nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
        ]);

        $validated['created_at'] = now();

        $announcement = Announcement::create($validated);

        return response()->json([
            'success' => true,
            'data' => $announcement,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'judul' => 'string|max:255',
            'isi' => 'string',
            'status' => 'in:Aktif,Nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
        ]);

        $announcement->update($validated);

        return response()->json([
            'success' => true,
            'data' => $announcement,
        ]);
    }

    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement tidak ditemukan',
            ], 404);
        }

        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Announcement berhasil dihapus',
        ]);
    }
}

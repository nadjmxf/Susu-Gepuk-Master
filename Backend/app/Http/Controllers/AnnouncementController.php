<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ImageHelper;

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
            'isi' => 'nullable|string',
            'gambar_announcement' => 'nullable|image|max:2048',
            'status' => 'required|in:Aktif,Nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
        ]);

        if ($request->hasFile('gambar_announcement')) {
            $validated['gambar_announcement'] = ImageHelper::convertToWebp($request->file('gambar_announcement'), 'announcements');
        }

        $validated['created_at'] = now();
        $validated['isi'] = $validated['isi'] ?? '-';

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
            'judul' => 'nullable|string|max:255',
            'isi' => 'nullable|string',
            'gambar_announcement' => 'nullable|image|max:2048',
            'status' => 'in:Aktif,Nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
        ]);

        if ($request->hasFile('gambar_announcement')) {
            // Delete old image if exists
            if ($announcement->gambar_announcement) {
                Storage::disk('public')->delete($announcement->gambar_announcement);
            }
            $validated['gambar_announcement'] = ImageHelper::convertToWebp($request->file('gambar_announcement'), 'announcements');
        }

        $validated['isi'] = $validated['isi'] ?? '-';

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

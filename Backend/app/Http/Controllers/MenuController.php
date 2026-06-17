<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::where('status_menu', 'Aktif')->get();

        return response()->json([
            'success' => true,
            'data' => $menus,
        ]);
    }

    public function show($id)
    {
        $menu = Menu::find($id);
        
        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $menu,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_admin' => 'required|exists:admins,id_admin',
            'nama_menu' => 'required|string',
            'harga' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'gambar_menu' => 'nullable|string',
            'kategori_menu' => 'required|in:Outlet,SOTR,Keduanya',
            'tag_menu' => 'nullable|in:New,Best Seller',
        ]);

        $menu = Menu::create($validated);

        return response()->json([
            'success' => true,
            'data' => $menu,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);
        
        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'nama_menu' => 'string',
            'harga' => 'integer',
            'deskripsi' => 'nullable|string',
            'gambar_menu' => 'nullable|string',
            'kategori_menu' => 'in:Outlet,SOTR,Keduanya',
            'tag_menu' => 'nullable|in:New,Best Seller',
            'status_menu' => 'in:Aktif,Nonaktif',
        ]);

        $menu->update($validated);

        return response()->json([
            'success' => true,
            'data' => $menu,
        ]);
    }

    public function destroy($id)
    {
        $menu = Menu::find($id);
        
        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan',
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil dihapus',
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\Menu;
use App\Models\Rider;
use Carbon\Carbon;

class PenjualanController extends Controller
{
    public function index()
    {
        $penjualan = Penjualan::all();

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ]);
    }

    public function show($id)
    {
        $penjualan = Penjualan::find($id);
        
        if (!$penjualan) {
            return response()->json([
                'success' => false,
                'message' => 'Penjualan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_rider' => 'required|exists:riders,id_rider',
            'tanggal_penjualan' => 'required|date',
            'jumlah_susu_basi' => 'integer|default:0',
            'jumlah_susu_rusak' => 'integer|default:0',
            'sisa_stok' => 'integer|default:0',
            'setoran_cash' => 'integer|default:0',
            'setoran_qris' => 'integer|default:0',
            'bukti_transfer' => 'nullable|string',
            'total_pendapatan' => 'required|integer',
            'jumlah_produk_terjual' => 'required|integer',
        ]);

        $penjualan = Penjualan::create($validated);

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $penjualan = Penjualan::find($id);
        
        if (!$penjualan) {
            return response()->json([
                'success' => false,
                'message' => 'Penjualan tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'tanggal_penjualan' => 'date',
            'jumlah_susu_basi' => 'integer',
            'jumlah_susu_rusak' => 'integer',
            'sisa_stok' => 'integer',
            'setoran_cash' => 'integer',
            'setoran_qris' => 'integer',
            'bukti_transfer' => 'nullable|string',
            'total_pendapatan' => 'integer',
            'jumlah_produk_terjual' => 'integer',
        ]);

        $penjualan->update($validated);

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ]);
    }

    public function destroy($id)
    {
        $penjualan = Penjualan::find($id);
        
        if (!$penjualan) {
            return response()->json([
                'success' => false,
                'message' => 'Penjualan tidak ditemukan',
            ], 404);
        }

        $penjualan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penjualan berhasil dihapus',
        ]);
    }

    // Get latest penjualan for a rider
    public function getLatestByRider($riderId)
    {
        $penjualan = Penjualan::where('id_rider', $riderId)
            ->orderBy('tanggal_penjualan', 'desc')
            ->first();

        if (!$penjualan) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada data penjualan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ]);
    }

    // Get today's penjualan for a rider
    public function getTodayByRider($riderId)
    {
        $today = Carbon::now()->toDateString();
        
        $penjualan = Penjualan::where('id_rider', $riderId)
            ->where('tanggal_penjualan', $today)
            ->first();

        if (!$penjualan) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada data penjualan hari ini',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $penjualan,
        ]);
    }

    // Get menu items with stock info for rider
    public function getMenuForRider($riderId)
    {
        $menus = Menu::where('status_menu', 'Aktif')
            ->select('id_menu', 'nama_menu', 'harga', 'stok_bawa')
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id_menu,
                    'name' => $menu->nama_menu,
                    'price' => $menu->harga,
                    'stokBawa' => $menu->stok_bawa ?? 20,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $menus,
        ]);
    }

    // Get rider info and today's data
    public function getRiderDataForRecap($riderId)
    {
        try {
            $rider = Rider::find($riderId);
            
            if (!$rider) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rider tidak ditemukan',
                ], 404);
            }

            $today = Carbon::now()->toDateString();
            $lastRecap = Penjualan::where('id_rider', $riderId)
                ->orderBy('tanggal_penjualan', 'desc')
                ->first();

            $menus = Menu::where('status_menu', 'Aktif')
                ->select('id_menu', 'nama_menu', 'harga', 'stok_bawa')
                ->get()
                ->map(function ($menu) {
                    return [
                        'id' => $menu->id_menu,
                        'name' => $menu->nama_menu,
                        'price' => $menu->harga,
                        'stokBawa' => $menu->stok_bawa ?? 20,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'rider' => [
                        'id' => $rider->id_rider,
                        'name' => $rider->nama_rider,
                        'phone' => $rider->no_hp,
                    ],
                    'today' => Carbon::parse($today)->format('d M Y'),
                    'menus' => $menus,
                    'lastRecap' => $lastRecap ? [
                        'tanggal' => Carbon::parse($lastRecap->tanggal_penjualan)->format('d M Y - H:i'),
                        'totalTerjual' => $lastRecap->jumlah_produk_terjual,
                        'sisaStok' => $lastRecap->sisa_stok,
                        'susuBasi' => $lastRecap->jumlah_susu_basi,
                        'kemasanRusak' => $lastRecap->jumlah_susu_rusak,
                        'totalPendapatan' => $lastRecap->total_pendapatan,
                    ] : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Store penjualan with file upload
    public function storeWithFile(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_rider' => 'required|integer|exists:riders,id_rider',
                'tanggal_penjualan' => 'required|date',
                'jumlah_produk_terjual' => 'required|integer|min:1',
                'jumlah_susu_basi' => 'required|integer|min:0',
                'jumlah_susu_rusak' => 'required|integer|min:0',
                'sisa_stok' => 'required|integer|min:0',
                'setoran_cash' => 'required|integer|min:0',
                'setoran_qris' => 'required|integer|min:0',
                'total_pendapatan' => 'required|integer|min:0',
                'bukti_transfer' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            // Validate that at least one payment method has amount
            if ($validated['setoran_cash'] === 0 && $validated['setoran_qris'] === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Setoran cash atau QRIS harus diisi',
                ], 422);
            }

            $buktiPath = null;
            if ($request->hasFile('bukti_transfer')) {
                $file = $request->file('bukti_transfer');
                $fileName = time() . '_' . preg_replace('/[^A-Za-z0-9_.-]/', '', $file->getClientOriginalName());
                $buktiPath = $file->storeAs('transfers', $fileName, 'public');
                $validated['bukti_transfer'] = $buktiPath;
            }

            $penjualan = Penjualan::create($validated);

            return response()->json([
                'success' => true,
                'data' => $penjualan,
                'message' => 'Data penjualan berhasil disimpan',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data penjualan: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get penjualan history for a rider (paginated)
    public function getHistoryByRider($riderId)
    {
        try {
            $penjualan = Penjualan::where('id_rider', $riderId)
                ->orderBy('tanggal_penjualan', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $penjualan->items(),
                'pagination' => [
                    'current_page' => $penjualan->currentPage(),
                    'total' => $penjualan->total(),
                    'per_page' => $penjualan->perPage(),
                    'last_page' => $penjualan->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

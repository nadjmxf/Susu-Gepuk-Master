<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\Menu;
use App\Models\Rider;
use App\Models\Aktivitas;
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
                        'status_live_location' => $rider->status_live_location,
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

            // Check if rider has already submitted today
            $today = Carbon::now()->toDateString();
            $existing = Penjualan::where('id_rider', $validated['id_rider'])
                ->where('tanggal_penjualan', $today)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan hari ini sudah pernah diisi. Hanya 1 laporan per hari yang diperbolehkan.',
                    'already_submitted' => true,
                    'data' => $existing,
                ], 409);
            }

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

            // ─── AUTO AKTIVITAS ──────────────────────────────────────────────
            // Jika rider berhasil submit laporan penjualan hari ini,
            // otomatis catat status 'Berjualan' di tabel aktivitas.
            // KECUALI sudah ada record Sakit/Izin yang diset oleh admin
            // (admin override = prioritas tertinggi).
            $tanggalLaporan = Carbon::parse($validated['tanggal_penjualan'])->toDateString();
            $existingAktivitas = Aktivitas::where('id_rider', $validated['id_rider'])
                ->where('tanggal_aktivitas', $tanggalLaporan)
                ->first();

            $adminStatuses = ['Sakit', 'Izin']; // Status yg diset admin, tidak boleh ditimpa
            if (!$existingAktivitas) {
                // Belum ada record aktivitas → buat baru
                Aktivitas::create([
                    'id_rider'          => $validated['id_rider'],
                    'tanggal_aktivitas' => $tanggalLaporan,
                    'status_aktivitas'  => 'Berjualan',
                    'keterangan'        => 'Otomatis: laporan penjualan dikirim',
                    'created_at'        => now(),
                ]);
            } elseif (!in_array($existingAktivitas->status_aktivitas, $adminStatuses)) {
                // Ada record tapi bukan Sakit/Izin → update ke Berjualan
                $existingAktivitas->update([
                    'status_aktivitas' => 'Berjualan',
                    'keterangan'       => 'Otomatis: laporan penjualan dikirim',
                ]);
            }
            // Jika Sakit/Izin → biarkan, jangan timpa
            // ─────────────────────────────────────────────────────────────────

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
    public function getHistoryByRider(Request $request, $riderId)
    {
        try {
            $monthName = $request->query('month');
            $year = $request->query('year');

            $query = Penjualan::where('id_rider', $riderId);

            if ($monthName && $year) {
                $monthMap = [
                    'Januari' => 1, 'Februari' => 2, 'Maret' => 3, 'April' => 4,
                    'Mei' => 5, 'Juni' => 6, 'Juli' => 7, 'Agustus' => 8,
                    'September' => 9, 'Oktober' => 10, 'November' => 11, 'Desember' => 12
                ];
                $monthNum = isset($monthMap[$monthName]) ? $monthMap[$monthName] : (is_numeric($monthName) ? $monthName : null);

                if ($monthNum) {
                    $query->whereMonth('tanggal_penjualan', $monthNum);
                }
                $query->whereYear('tanggal_penjualan', $year);
            }

            // Calculate summary before pagination
            $summary = [
                'total_transaksi' => $query->count(),
                'total_produk' => (int) $query->sum('jumlah_produk_terjual'),
                'total_susu_basi' => (int) $query->sum('jumlah_susu_basi'),
                'total_susu_rusak' => (int) $query->sum('jumlah_susu_rusak'),
                'total_pendapatan' => (int) $query->sum('total_pendapatan'),
            ];

            $penjualan = $query->orderBy('tanggal_penjualan', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $penjualan->items(),
                'summary' => $summary,
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

    // Get monthly Rekap reports summary for admin panel
    public function getReportsSummary(Request $request)
    {
        try {
            $monthName = $request->query('month', 'Juni');
            $year = $request->query('year', '2026');

            // Map Indonesian month name to number
            $monthMap = [
                'Januari' => 1, 'Februari' => 2, 'Maret' => 3, 'April' => 4,
                'Mei' => 5, 'Juni' => 6, 'Juli' => 7, 'Agustus' => 8,
                'September' => 9, 'Oktober' => 10, 'November' => 11, 'Desember' => 12
            ];
            
            $monthNum = isset($monthMap[$monthName]) ? $monthMap[$monthName] : Carbon::now()->month;

            // Query base
            $queryBase = Penjualan::with('rider')
                ->whereYear('tanggal_penjualan', $year)
                ->whereMonth('tanggal_penjualan', $monthNum);

            // Calculate metrics sums using the base query
            $totalTerjual = (int) $queryBase->sum('jumlah_produk_terjual');
            $totalBasi = (int) $queryBase->sum('jumlah_susu_basi');
            $totalRusak = (int) $queryBase->sum('jumlah_susu_rusak');
            // Calculate total pendapatan from the actual setoran so it perfectly matches the table data
            $totalPendapatan = (int) $queryBase->sum('setoran_cash') + (int) $queryBase->sum('setoran_qris');

            // Daily entries grouped by rider
            $query = Penjualan::with('rider')
                ->whereYear('tanggal_penjualan', $year)
                ->whereMonth('tanggal_penjualan', $monthNum)
                ->select(
                    'id_rider',
                    \DB::raw('SUM(jumlah_produk_terjual + sisa_stok + jumlah_susu_basi + jumlah_susu_rusak) as total_bawa'),
                    \DB::raw('SUM(jumlah_produk_terjual) as total_terjual'),
                    \DB::raw('SUM(jumlah_susu_basi) as total_basi'),
                    \DB::raw('SUM(jumlah_susu_rusak) as total_rusak'),
                    \DB::raw('SUM(setoran_cash + setoran_qris) as total_setoran')
                )
                ->groupBy('id_rider');

            $penjualans = $query->paginate(10);

            $formattedData = collect($penjualans->items())->map(function ($item) {
                return [
                    'id_rider' => $item->id_rider,
                    'rider' => $item->rider ? $item->rider->nama_rider : 'Rider Tidak Dikenal',
                    'unit' => $item->rider ? ($item->rider->area ?: 'SOTR Unit') : 'SOTR Unit',
                    'gps' => $item->rider ? ($item->rider->current_location ?: 'Pekanbaru') : 'Pekanbaru',
                    'bawa' => (int)$item->total_bawa,
                    'terjual' => (int)$item->total_terjual,
                    'basi' => (int)$item->total_basi,
                    'rusak' => (int)$item->total_rusak,
                    'setoran' => (int)$item->total_setoran,
                ];
            });

            return response()->json([
                'success' => true,
                'metrics' => [
                    'terjual' => number_format($totalTerjual, 0, ',', '.') . ' pcs',
                    'basi' => number_format($totalBasi, 0, ',', '.') . ' pcs',
                    'rusak' => number_format($totalRusak, 0, ',', '.') . ' pcs',
                    'pendapatan' => 'Rp ' . number_format($totalPendapatan, 0, ',', '.'),
                ],
                'data' => $formattedData,
                'pagination' => [
                    'current_page' => $penjualans->currentPage(),
                    'total' => $penjualans->total(),
                    'per_page' => $penjualans->perPage(),
                    'last_page' => $penjualans->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laporan: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get daily details for a specific rider in a specific month
    public function getDailyReportByRider(Request $request, $id_rider)
    {
        try {
            $monthName = $request->query('month', 'Juni');
            $year = $request->query('year', '2026');

            $monthMap = [
                'Januari' => 1, 'Februari' => 2, 'Maret' => 3, 'April' => 4,
                'Mei' => 5, 'Juni' => 6, 'Juli' => 7, 'Agustus' => 8,
                'September' => 9, 'Oktober' => 10, 'November' => 11, 'Desember' => 12
            ];
            
            $monthNum = isset($monthMap[$monthName]) ? $monthMap[$monthName] : Carbon::now()->month;

            $penjualans = Penjualan::where('id_rider', $id_rider)
                ->whereYear('tanggal_penjualan', $year)
                ->whereMonth('tanggal_penjualan', $monthNum)
                ->orderBy('tanggal_penjualan', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedData = $penjualans->map(function ($item) {
                $bawa = $item->jumlah_produk_terjual + $item->sisa_stok + $item->jumlah_susu_basi + $item->jumlah_susu_rusak;
                
                $metode = 'CASH';
                if ($item->setoran_qris > 0 && $item->setoran_cash > 0) {
                    $metode = 'MIXED';
                } elseif ($item->setoran_qris > 0) {
                    $metode = 'QRIS';
                }

                return [
                    'id' => $item->id_penjualan,
                    'tanggal' => Carbon::parse($item->tanggal_penjualan)->locale('id')->isoFormat('D MMMM Y'),
                    'waktu' => Carbon::parse($item->created_at)->format('H:i') . ' WIB',
                    'bawa' => $bawa,
                    'terjual' => $item->jumlah_produk_terjual,
                    'basi' => $item->jumlah_susu_basi,
                    'rusak' => $item->jumlah_susu_rusak,
                    'metode' => $metode,
                    'setoran' => $item->setoran_cash + $item->setoran_qris,
                    'pendapatan_sistem' => (int) $item->total_pendapatan,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil rincian laporan: ' . $e->getMessage(),
            ], 500);
        }
    }
}

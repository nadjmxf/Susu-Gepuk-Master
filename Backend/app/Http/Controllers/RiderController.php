<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rider;
use App\Models\Lokasi;
use App\Models\Aktivitas;
use App\Helpers\ImageHelper;

class RiderController extends Controller
{
    public function index()
    {
        $riders = Rider::all()->map(function($rider) {
            // Get latest activity
            $latestActivity = \App\Models\Aktivitas::where('id_rider', $rider->id_rider)
                ->orderBy('tanggal_aktivitas', 'desc')
                ->first();

            $statusKehadiran = 'TIDAK ADA AKTIVITAS';
            if ($latestActivity) {
                if ($latestActivity->status_aktivitas === 'Berjualan') {
                    $statusKehadiran = 'HADIR';
                } else if ($latestActivity->status_aktivitas === 'Izin') {
                    $statusKehadiran = 'IZIN';
                } else if ($latestActivity->status_aktivitas === 'Sakit') {
                    $statusKehadiran = 'SAKIT';
                } else {
                    $statusKehadiran = 'TIDAK ADA AKTIVITAS';
                }
            }
            
            $rider->status_kehadiran = $statusKehadiran;

            // Get SOTR outlet area if assigned
            $sotrOutlet = \App\Models\Outlet::where('id_rider', $rider->id_rider)
                ->where('jenis_outlet', 'Outlet Bergerak')
                ->first();
            if ($sotrOutlet) {
                $rider->area = $sotrOutlet->area;
                $rider->nama_outlet = $sotrOutlet->nama_outlet;
            }

            // Get latest location coordinates if live location is active
            if ($rider->status_live_location === 'Aktif') {
                $lastLocation = \App\Models\Lokasi::where('id_rider', $rider->id_rider)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($lastLocation) {
                    $rider->latitude = floatval($lastLocation->latitude);
                    $rider->longitude = floatval($lastLocation->longitude);
                }

                if (empty($rider->current_location)) {
                    $rider->current_location = ($lastLocation && !empty($lastLocation->alamat))
                        ? $lastLocation->alamat
                        : ($rider->area ? 'Area ' . $rider->area : 'Pekanbaru');
                }
            } else {
                $rider->current_location = null;
                $rider->latitude = null;
                $rider->longitude = null;
            }

            return $rider;
        });

        return response()->json([
            'success' => true,
            'data' => $riders,
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

        // Get SOTR outlet area if assigned
        $sotrOutlet = \App\Models\Outlet::where('id_rider', $rider->id_rider)
            ->where('jenis_outlet', 'Outlet Bergerak')
            ->first();
        if ($sotrOutlet) {
            $rider->area = $sotrOutlet->area;
            $rider->nama_outlet = $sotrOutlet->nama_outlet;
        }

        // Calculate performance metrics (e.g. for the current month)
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $produkTerjual = \App\Models\Penjualan::where('id_rider', $id)
            ->whereMonth('tanggal_penjualan', $currentMonth)
            ->whereYear('tanggal_penjualan', $currentYear)
            ->sum('jumlah_produk_terjual');

        $totalPendapatan = \App\Models\Penjualan::where('id_rider', $id)
            ->whereMonth('tanggal_penjualan', $currentMonth)
            ->whereYear('tanggal_penjualan', $currentYear)
            ->sum(\DB::raw('setoran_cash + setoran_qris'));

        $targetPendapatan = 15000000; // default 15 million

        // Get latest location coordinates
        $lastLocation = \App\Models\Lokasi::where('id_rider', $id)
            ->orderBy('created_at', 'desc')
            ->first();

        // Get count of attendance types in the current month
        $hadirCount = \App\Models\Aktivitas::where('id_rider', $id)
            ->whereMonth('tanggal_aktivitas', $currentMonth)
            ->whereYear('tanggal_aktivitas', $currentYear)
            ->where('status_aktivitas', 'Berjualan')
            ->count();

        $izinCount = \App\Models\Aktivitas::where('id_rider', $id)
            ->whereMonth('tanggal_aktivitas', $currentMonth)
            ->whereYear('tanggal_aktivitas', $currentYear)
            ->where('status_aktivitas', 'Izin')
            ->count();

        $sakitCount = \App\Models\Aktivitas::where('id_rider', $id)
            ->whereMonth('tanggal_aktivitas', $currentMonth)
            ->whereYear('tanggal_aktivitas', $currentYear)
            ->where('status_aktivitas', 'Sakit')
            ->count();

        $rider->performance = [
            'produk_terjual' => intval($produkTerjual),
            'total_pendapatan' => intval($totalPendapatan),
            'target_pendapatan' => $targetPendapatan,
        ];

        $rider->attendance_summary = [
            'hadir' => $hadirCount,
            'izin' => $izinCount,
            'sakit' => $sakitCount,
        ];

        $isLiveActive = $rider->status_live_location === 'Aktif';

        $rider->location = [
            'latitude' => ($isLiveActive && $lastLocation) ? floatval($lastLocation->latitude) : null,
            'longitude' => ($isLiveActive && $lastLocation) ? floatval($lastLocation->longitude) : null,
            'alamat' => ($isLiveActive && $lastLocation) ? ($lastLocation->alamat ?? 'Lokasi tidak tersedia') : 'Lokasi tidak tersedia',
            'waktu_update' => ($isLiveActive && $lastLocation) ? $lastLocation->waktu_update : null,
        ];

        // Also determine current status_kehadiran
        $latestActivity = \App\Models\Aktivitas::where('id_rider', $id)
            ->orderBy('tanggal_aktivitas', 'desc')
            ->first();
        
        $statusKehadiran = 'TIDAK ADA AKTIVITAS';
        if ($latestActivity) {
            if ($latestActivity->status_aktivitas === 'Berjualan') {
                $statusKehadiran = 'HADIR';
            } else if ($latestActivity->status_aktivitas === 'Izin') {
                $statusKehadiran = 'IZIN';
            } else if ($latestActivity->status_aktivitas === 'Sakit') {
                $statusKehadiran = 'SAKIT';
            }
        }
        $rider->status_kehadiran = $statusKehadiran;

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
            'foto_rider' => 'nullable|image|max:2048',
            'area' => 'nullable|string',
        ]);

        if ($request->hasFile('foto_rider')) {
            $validated['foto_rider'] = ImageHelper::convertToWebp($request->file('foto_rider'), 'riders');
        }

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
            'username' => 'string|unique:riders,username,' . $id . ',id_rider',
            'password' => 'nullable|string|min:6',
            'status_akun' => 'in:Aktif,Nonaktif',
            'status_jualan' => 'in:Tersedia,Habis',
            'status_live_location' => 'in:Aktif,Nonaktif',
            'area' => 'nullable|string',
            'foto_rider' => 'nullable|image|max:2048',
        ]);

        if (isset($validated['status_akun'])) {
            $validated['status_live_location'] = 'Nonaktif';
            $validated['current_location'] = null;
        }

        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($request->hasFile('foto_rider')) {
            // Delete old photo if exists
            if ($rider->foto_rider) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($rider->foto_rider);
            }
            $validated['foto_rider'] = ImageHelper::convertToWebp($request->file('foto_rider'), 'riders');
        }

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

    public function getLocation(Request $request, $id)
    {
        // IDOR protection: rider hanya bisa akses lokasi sendiri
        if ($request->user() instanceof \App\Models\Rider && $request->user()->id_rider !== (int) $id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke data rider ini.',
            ], 403);
        }

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

        $isLiveActive = $rider->status_live_location === 'Aktif';

        return response()->json([
            'success' => true,
            'data' => [
                'id_rider' => $rider->id_rider,
                'status_live_location' => $rider->status_live_location,
                'latitude' => ($isLiveActive && $lastLocation) ? floatval($lastLocation->latitude) : null,
                'longitude' => ($isLiveActive && $lastLocation) ? floatval($lastLocation->longitude) : null,
                'waktu_update' => ($isLiveActive && $lastLocation) ? $lastLocation->waktu_update : null,
                'alamat' => ($isLiveActive && $lastLocation) ? ($lastLocation->alamat ?? 'Lokasi tidak tersedia') : 'Lokasi tidak tersedia',
            ],
        ]);
    }

    public function updateLocation(Request $request, $id)
    {
        // IDOR protection: rider hanya bisa update lokasi sendiri
        if ($request->user() instanceof \App\Models\Rider && $request->user()->id_rider !== (int) $id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke data rider ini.',
            ], 403);
        }

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

    public function getActivity(Request $request, $id)
    {
        $rider = Rider::find($id);
        
        if (!$rider) {
            return response()->json([
                'success' => false,
                'message' => 'Rider tidak ditemukan',
            ], 404);
        }

        $query = \App\Models\Aktivitas::where('id_rider', $id);

        if ($request->has('month') && $request->has('year')) {
            $monthName = $request->query('month');
            $year = $request->query('year');

            // Map Indonesian month names to digits
            $monthsMap = [
                'Januari' => 1, 'Februari' => 2, 'Maret' => 3, 'April' => 4,
                'Mei' => 5, 'Juni' => 6, 'Juli' => 7, 'Agustus' => 8,
                'September' => 9, 'Oktober' => 10, 'November' => 11, 'Desember' => 12
            ];

            $month = $monthsMap[$monthName] ?? $monthName;

            if (is_numeric($month)) {
                $query->whereMonth('tanggal_aktivitas', $month);
            }
            if (is_numeric($year)) {
                $query->whereYear('tanggal_aktivitas', $year);
            }
        }

        $activities = $query->orderBy('tanggal_aktivitas', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $activities,
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

        $validated = $request->validate([
            'tanggal_aktivitas' => 'required|date',
            'status_aktivitas' => 'required|in:Berjualan,Izin,Sakit,Tidak Ada Aktivitas',
            'keterangan' => 'nullable|string',
        ]);

        // Check if activity already exists for this rider on this date
        $existing = Aktivitas::where('id_rider', $id)
            ->where('tanggal_aktivitas', $validated['tanggal_aktivitas'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Absensi untuk tanggal tersebut sudah tercatat. Rider hanya bisa input 1 kali per hari.',
            ], 400);
        }

        // Create new
        $aktivitas = Aktivitas::create([
            'id_rider' => $id,
            'tanggal_aktivitas' => $validated['tanggal_aktivitas'],
            'status_aktivitas' => $validated['status_aktivitas'],
            'keterangan' => $validated['keterangan'] ?? null,
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kehadiran berhasil dicatat',
            'data' => $aktivitas,
        ], 201);
    }
}

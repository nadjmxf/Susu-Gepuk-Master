<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Rider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login Admin
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login admin berhasil.',
            'role' => 'admin',
            'data' => [
                'id_admin' => $admin->id_admin,
                'nama_admin' => $admin->nama_admin,
                'username' => $admin->username,
            ]
        ]);
    }

    // Login Rider
    public function loginRider(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $rider = Rider::where('username', $request->username)->first();

        if (!$rider || !Hash::check($request->password, $rider->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah.'
            ], 401);
        }

        if ($rider->status_akun === 'Nonaktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun rider tidak aktif.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login rider berhasil.',
            'role' => 'rider',
            'data' => [
                'id_rider' => $rider->id_rider,
                'nama_rider' => $rider->nama_rider,
                'username' => $rider->username,
                'foto_rider' => $rider->foto_rider,
                'status_jualan' => $rider->status_jualan,
                'status_live_location' => $rider->status_live_location,
            ]
        ]);
    }

    // Logout (opsional jika belum pakai token)
    public function logout()
    {
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.'
        ]);
    }
}
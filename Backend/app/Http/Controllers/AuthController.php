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

        // Create Sanctum token for admin
        $token = $admin->createToken('admin-token', ['role:admin'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login admin berhasil.',
            'role' => 'admin',
            'token' => $token,
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

        // Create Sanctum token for rider
        $token = $rider->createToken('rider-token', ['role:rider'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login rider berhasil.',
            'role' => 'rider',
            'token' => $token,
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

    // Logout — invalidate current token
    public function logout(Request $request)
    {
        // Delete the token that was used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.'
        ]);
    }

    // Get current authenticated user info
    public function me(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Admin) {
            return response()->json([
                'success' => true,
                'role' => 'admin',
                'data' => [
                    'id_admin' => $user->id_admin,
                    'nama_admin' => $user->nama_admin,
                    'username' => $user->username,
                ]
            ]);
        }

        if ($user instanceof Rider) {
            return response()->json([
                'success' => true,
                'role' => 'rider',
                'data' => [
                    'id_rider' => $user->id_rider,
                    'nama_rider' => $user->nama_rider,
                    'username' => $user->username,
                    'foto_rider' => $user->foto_rider,
                    'status_jualan' => $user->status_jualan,
                    'status_live_location' => $user->status_live_location,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User tidak dikenali',
        ], 401);
    }
}
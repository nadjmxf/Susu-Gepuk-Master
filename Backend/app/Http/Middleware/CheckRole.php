<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('role:admin') or ->middleware('role:rider')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Silakan login terlebih dahulu.',
            ], 401);
        }

        // Check role based on model type
        if ($role === 'admin' && !($user instanceof \App\Models\Admin)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya admin yang diizinkan.',
            ], 403);
        }

        if ($role === 'rider' && !($user instanceof \App\Models\Rider)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya rider yang diizinkan.',
            ], 403);
        }

        return $next($request);
    }
}

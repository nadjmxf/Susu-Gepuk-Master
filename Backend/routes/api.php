<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RiderController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\AnnouncementController;

/*
|--------------------------------------------------------------------------
| Public Routes (tanpa authentication)
|--------------------------------------------------------------------------
| Route yang boleh diakses oleh siapa saja, termasuk pelanggan.
*/

// Authentication — login (dengan rate limiting: max 5 request per menit)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login/admin', [AuthController::class, 'loginAdmin']);
    Route::post('/login/rider', [AuthController::class, 'loginRider']);
});

// Data publik — pelanggan boleh lihat outlet, menu, pengumuman, dan lokasi rider SOTR
Route::get('/outlet', [OutletController::class, 'index']);
Route::get('/outlet/{id}', [OutletController::class, 'show']);
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);
Route::get('/rider', [RiderController::class, 'index']);
Route::get('/rider/{id}', [RiderController::class, 'show']);
Route::get('/rider/{id}/location', [RiderController::class, 'getLocation']);
Route::get('/sotr/locations', [\App\Http\Controllers\LokasiBiController::class, 'index']);
Route::get('/announcement', [AnnouncementController::class, 'index']);
Route::get('/announcement/{id}', [AnnouncementController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (harus login dulu)
|--------------------------------------------------------------------------
| Route yang membutuhkan token Sanctum yang valid.
*/

Route::middleware('auth:sanctum')->group(function () {

    // Logout & user info (admin atau rider)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Admin-Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {

        // Kelola Admin
        Route::apiResource('admin', AdminController::class);

        // Kelola Rider (CRUD oleh admin)
        Route::post('/rider', [RiderController::class, 'store']);
        Route::put('/rider/{id}', [RiderController::class, 'update']);
        Route::delete('/rider/{id}', [RiderController::class, 'destroy']);

        // Kelola aktivitas rider (oleh admin)
        Route::get('/rider/{id}/activity', [RiderController::class, 'getActivity']);
        Route::post('/rider/{id}/activity', [RiderController::class, 'storeActivity']);

        // Kelola Outlet (CRUD oleh admin)
        Route::post('/outlet', [OutletController::class, 'store']);
        Route::put('/outlet/{id}', [OutletController::class, 'update']);
        Route::delete('/outlet/{id}', [OutletController::class, 'destroy']);

        // Kelola Menu (CRUD oleh admin)
        Route::post('/menu', [MenuController::class, 'store']);
        Route::put('/menu/{id}', [MenuController::class, 'update']);
        Route::delete('/menu/{id}', [MenuController::class, 'destroy']);

        // Kelola Announcement (CRUD oleh admin)
        Route::post('/announcement', [AnnouncementController::class, 'store']);
        Route::put('/announcement/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/announcement/{id}', [AnnouncementController::class, 'destroy']);

        // Laporan Penjualan (admin view)
        Route::get('/penjualan', [PenjualanController::class, 'index']);
        Route::get('/penjualan/{id}', [PenjualanController::class, 'show']);
        Route::put('/penjualan/{id}', [PenjualanController::class, 'update']);
        Route::delete('/penjualan/{id}', [PenjualanController::class, 'destroy']);
        Route::get('/penjualan/reports/summary', [PenjualanController::class, 'getReportsSummary']);
        Route::get('/penjualan/reports/rider/{id}/daily', [PenjualanController::class, 'getDailyReportByRider']);
    });

    /*
    |--------------------------------------------------------------------------
    | Rider-Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:rider')->group(function () {

        // Lokasi rider (hanya bisa update lokasi sendiri — dicek di controller)
        Route::put('/rider/{id}/location', [RiderController::class, 'updateLocation']);

        // Penjualan rider (hanya data sendiri — dicek di controller)
        Route::post('/penjualan/store-with-file', [PenjualanController::class, 'storeWithFile']);
        Route::get('/penjualan/rider/{id}/latest', [PenjualanController::class, 'getLatestByRider']);
        Route::get('/penjualan/rider/{id}/today', [PenjualanController::class, 'getTodayByRider']);
        Route::get('/penjualan/rider/{id}/data-recap', [PenjualanController::class, 'getRiderDataForRecap']);
        Route::get('/penjualan/rider/{id}/history', [PenjualanController::class, 'getHistoryByRider']);
        Route::get('/penjualan/rider/{id}/menu', [PenjualanController::class, 'getMenuForRider']);
    });
});
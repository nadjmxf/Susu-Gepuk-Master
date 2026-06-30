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
| Authentication
|--------------------------------------------------------------------------
*/

Route::post('/login/admin', [AuthController::class, 'loginAdmin']);
Route::post('/login/rider', [AuthController::class, 'loginRider']);
Route::post('/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::apiResource('admin', AdminController::class);

/*
|--------------------------------------------------------------------------
| Rider
|--------------------------------------------------------------------------
*/

Route::apiResource('rider', RiderController::class);

/*
|--------------------------------------------------------------------------
| Rider Location
|--------------------------------------------------------------------------
*/

Route::get('/rider/{id}/location', [RiderController::class, 'getLocation']);
Route::put('/rider/{id}/location', [RiderController::class, 'updateLocation']);
Route::get('/sotr/locations', [\App\Http\Controllers\LokasiBiController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Rider Activity
|--------------------------------------------------------------------------
*/

Route::get('/rider/{id}/activity', [RiderController::class, 'getActivity']);
Route::post('/rider/{id}/activity', [RiderController::class, 'storeActivity']);

/*
|--------------------------------------------------------------------------
| Outlet
|--------------------------------------------------------------------------
*/

Route::apiResource('outlet', OutletController::class);

/*
|--------------------------------------------------------------------------
| Menu
|--------------------------------------------------------------------------
*/

Route::apiResource('menu', MenuController::class);

/*
|--------------------------------------------------------------------------
| Penjualan
|--------------------------------------------------------------------------
*/

Route::get('/penjualan/reports/summary', [PenjualanController::class, 'getReportsSummary']);
Route::apiResource('penjualan', PenjualanController::class);
Route::get('/penjualan/rider/{id}/latest', [PenjualanController::class, 'getLatestByRider']);
Route::get('/penjualan/rider/{id}/today', [PenjualanController::class, 'getTodayByRider']);
Route::get('/penjualan/rider/{id}/data-recap', [PenjualanController::class, 'getRiderDataForRecap']);
Route::get('/penjualan/rider/{id}/history', [PenjualanController::class, 'getHistoryByRider']);
Route::post('/penjualan/store-with-file', [PenjualanController::class, 'storeWithFile']);
Route::get('/penjualan/rider/{id}/menu', [PenjualanController::class, 'getMenuForRider']);

/*
|--------------------------------------------------------------------------
| Informasi Operasional
|--------------------------------------------------------------------------
*/

Route::apiResource('announcement', AnnouncementController::class);
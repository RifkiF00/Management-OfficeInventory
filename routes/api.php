<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\RuanganController;
use App\Http\Controllers\Api\MutasiController;
use App\Http\Controllers\Api\PengadaanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Route
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Master Data
    Route::get('/barang', [BarangController::class, 'index']);
    Route::get('/ruangan', [RuanganController::class, 'index']);

    // Transactions
    Route::post('/mutasi', [MutasiController::class, 'store']);
    Route::get('/pengadaan', [PengadaanController::class, 'index']);
    Route::post('/pengadaan', [PengadaanController::class, 'store']);
});

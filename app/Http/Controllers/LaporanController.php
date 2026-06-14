<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Mutasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    /**
     * Display report page.
     */
    public function index(Request $request)
    {
        // Only Admin or Kepala Bagian can view report
        if (! in_array($request->user()->role, ['admin', 'kepala'])) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak. Peran Anda tidak diizinkan mengakses laporan.');
        }

        $barangs = Barang::with('ruangan')->get();
        
        $mutasis = Mutasi::with(['barang', 'ruanganAsal', 'ruanganTujuan', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Laporan/Index', [
            'barangs' => $barangs,
            'mutasis' => $mutasis,
        ]);
    }
}

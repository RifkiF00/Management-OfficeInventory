<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Mutasi;
use App\Models\Pengadaan;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard with statistics.
     */
    public function index()
    {
        $totalRuangan = Ruangan::count();
        $totalBarang = Barang::sum('jumlah') ?? 0;
        $totalMutasi = Mutasi::count();
        $pengadaanPending = Pengadaan::where('status', 'Diajukan')->count();

        // Fetch recent activities
        $recentMutasi = Mutasi::with(['barang', 'ruanganAsal', 'ruanganTujuan', 'user'])
            ->latest()
            ->limit(5)
            ->get();

        $recentPengadaan = Pengadaan::with(['pemohon', 'penyetuju'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_ruangan' => $totalRuangan,
                'total_barang' => $totalBarang,
                'total_mutasi' => $totalMutasi,
                'pengadaan_pending' => $pengadaanPending,
            ],
            'recent_mutasi' => $recentMutasi,
            'recent_pengadaan' => $recentPengadaan,
        ]);
    }
}

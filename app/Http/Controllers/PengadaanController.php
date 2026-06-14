<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pengadaan;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PengadaanController extends Controller
{
    /**
     * Display a listing of procurement requests.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'staf') {
            $pengadaans = Pengadaan::with(['pemohon', 'penyetuju'])
                ->where('user_pemohon_id', $user->id)
                ->latest()
                ->get();
        } else {
            $pengadaans = Pengadaan::with(['pemohon', 'penyetuju'])
                ->latest()
                ->get();
        }

        $ruangans = Ruangan::all();

        return Inertia::render('Pengadaan/Index', [
            'pengadaans' => $pengadaans,
            'ruangans' => $ruangans
        ]);
    }

    /**
     * Store a newly created procurement request in storage.
     */
    public function store(Request $request)
    {
        // Only staff can request
        if ($request->user()->role !== 'staf') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Staf yang dapat mengajukan pengadaan.');
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'estimasi_harga' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        Pengadaan::create([
            'nama_barang' => $request->nama_barang,
            'jumlah' => $request->jumlah,
            'estimasi_harga' => $request->estimasi_harga,
            'status' => 'Diajukan',
            'user_pemohon_id' => $request->user()->id,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->back()->with('success', 'Pengajuan pengadaan berhasil dikirim.');
    }

    /**
     * Update the status of a procurement request (Approve/Reject).
     */
    public function updateStatus(Request $request, Pengadaan $pengadaan)
    {
        // Only Kepala Bagian can approve/reject
        if ($request->user()->role !== 'kepala') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Kepala Bagian yang dapat menyetujui pengadaan.');
        }

        $request->validate([
            'status' => 'required|in:Disetujui,Ditolak',
            'ruangan_id' => 'required_if:status,Disetujui|exists:ruangan,id|nullable',
        ]);

        $result = DB::transaction(function () use ($request, $pengadaan) {
            $status = $request->status;

            if ($status === 'Disetujui') {
                // Update Pengadaan
                $pengadaan->update([
                    'status' => 'Disetujui',
                    'user_penyetuju_id' => $request->user()->id,
                    'tanggal_pengadaan' => now(),
                ]);

                // Create or Increment Inventory Item (Barang)
                $targetBarang = Barang::where('ruangan_id', $request->ruangan_id)
                    ->where('nama_barang', $pengadaan->nama_barang)
                    ->first();

                if ($targetBarang) {
                    $targetBarang->increment('jumlah', $pengadaan->jumlah);
                } else {
                    Barang::create([
                        'nama_barang' => $pengadaan->nama_barang,
                        'kode_barang' => 'B-PGD-' . rand(1000, 9999),
                        'ruangan_id' => $request->ruangan_id,
                        'kondisi' => 'Baik',
                        'jumlah' => $pengadaan->jumlah,
                        'deskripsi' => 'Pengadaan disetujui. Ket: ' . $pengadaan->keterangan,
                    ]);
                }
            } else {
                // Rejected
                $pengadaan->update([
                    'status' => 'Ditolak',
                    'user_penyetuju_id' => $request->user()->id,
                ]);
            }

            return [
                'success' => true,
                'message' => "Pengajuan pengadaan berhasil di-{$status}."
            ];
        });

        return redirect()->back()->with('success', $result['message']);
    }
}

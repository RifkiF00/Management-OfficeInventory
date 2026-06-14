<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Mutasi;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MutasiController extends Controller
{
    /**
     * Display a listing of mutations.
     */
    public function index()
    {
        $mutasis = Mutasi::with(['barang', 'ruanganAsal', 'ruanganTujuan', 'user'])
            ->latest()
            ->get();

        $barangs = Barang::all();
        $ruangans = Ruangan::all();

        return Inertia::render('Mutasi/Index', [
            'mutasis' => $mutasis,
            'barangs' => $barangs,
            'ruangans' => $ruangans
        ]);
    }

    /**
     * Store a newly created mutation in storage.
     */
    public function store(Request $request)
    {
        // Only Admin or Staff can initiate mutations
        if (! in_array($request->user()->role, ['admin', 'staf'])) {
            return redirect()->back()->with('error', 'Akses ditolak. Peran Anda tidak diizinkan melakukan mutasi.');
        }

        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'ruangan_tujuan_id' => 'required|exists:ruangan,id',
            'jumlah' => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $result = DB::transaction(function () use ($request) {
            $barang = Barang::lockForUpdate()->find($request->barang_id);

            if ($barang->jumlah < $request->jumlah) {
                return [
                    'success' => false,
                    'message' => "Stok barang tidak mencukupi. Stok saat ini: {$barang->jumlah}"
                ];
            }

            $ruanganAsalId = $barang->ruangan_id;

            if ($ruanganAsalId == $request->ruangan_tujuan_id) {
                return [
                    'success' => false,
                    'message' => 'Ruangan tujuan tidak boleh sama dengan ruangan asal.'
                ];
            }

            // 1. Create Mutasi Log
            Mutasi::create([
                'barang_id' => $barang->id,
                'ruangan_asal_id' => $ruanganAsalId,
                'ruangan_tujuan_id' => $request->ruangan_tujuan_id,
                'jumlah' => $request->jumlah,
                'tanggal_mutasi' => now(),
                'keterangan' => $request->keterangan,
                'user_id' => $request->user()->id,
            ]);

            // 2. Shift Inventory
            if ($barang->jumlah == $request->jumlah) {
                // Move whole item to target room
                $barang->update([
                    'ruangan_id' => $request->ruangan_tujuan_id
                ]);
            } else {
                // Partial move
                $barang->decrement('jumlah', $request->jumlah);

                // Add or create in target room
                $targetBarang = Barang::where('ruangan_id', $request->ruangan_tujuan_id)
                    ->where('nama_barang', $barang->nama_barang)
                    ->first();

                if ($targetBarang) {
                    $targetBarang->increment('jumlah', $request->jumlah);
                } else {
                    Barang::create([
                        'nama_barang' => $barang->nama_barang,
                        'kode_barang' => $barang->kode_barang . '-M' . rand(10, 99),
                        'ruangan_id' => $request->ruangan_tujuan_id,
                        'kondisi' => $barang->kondisi,
                        'jumlah' => $request->jumlah,
                        'deskripsi' => $barang->deskripsi,
                    ]);
                }
            }

            return [
                'success' => true,
                'message' => 'Mutasi barang berhasil diproses.'
            ];
        });

        if (! $result['success']) {
            return redirect()->back()->with('error', $result['message']);
        }

        return redirect()->back()->with('success', $result['message']);
    }
}

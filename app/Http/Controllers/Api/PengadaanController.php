<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengadaan;
use Illuminate\Http\Request;

class PengadaanController extends Controller
{
    /**
     * Display a listing of procurement requests.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // If regular staff, only show their own requests
        if ($user->role === 'staf') {
            $pengadaans = Pengadaan::with('pemohon', 'penyetuju')
                ->where('user_pemohon_id', $user->id)
                ->get();
        } else {
            // Admin and Kepala Bagian can view all requests
            $pengadaans = Pengadaan::with('pemohon', 'penyetuju')->get();
        }

        return response()->json([
            'success' => true,
            'data' => $pengadaans
        ]);
    }

    /**
     * Store a newly created procurement request in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'estimasi_harga' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $pengadaan = Pengadaan::create([
            'nama_barang' => $request->nama_barang,
            'jumlah' => $request->jumlah,
            'estimasi_harga' => $request->estimasi_harga,
            'status' => 'Diajukan',
            'user_pemohon_id' => $request->user()->id,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengadaan berhasil diajukan.',
            'data' => $pengadaan
        ], 201);
    }
}

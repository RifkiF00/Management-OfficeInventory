<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Mutasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MutasiController extends Controller
{
    /**
     * Store a newly created mutasi (item movement) in storage.
     */
    public function store(Request $request)
    {
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
                    'message' => "Stok barang tidak mencukupi. Stok saat ini: {$barang->jumlah}",
                    'code' => 422
                ];
            }

            $ruanganAsalId = $barang->ruangan_id;

            if ($ruanganAsalId == $request->ruangan_tujuan_id) {
                return [
                    'success' => false,
                    'message' => 'Ruangan tujuan tidak boleh sama dengan ruangan asal.',
                    'code' => 422
                ];
            }

            // 1. Create Mutasi Record
            $mutasi = Mutasi::create([
                'barang_id' => $barang->id,
                'ruangan_asal_id' => $ruanganAsalId,
                'ruangan_tujuan_id' => $request->ruangan_tujuan_id,
                'jumlah' => $request->jumlah,
                'tanggal_mutasi' => now(),
                'keterangan' => $request->keterangan,
                'user_id' => $request->user()->id,
            ]);

            // 2. Adjust Inventories
            if ($barang->jumlah == $request->jumlah) {
                // Move entire stock to the new room
                $barang->update([
                    'ruangan_id' => $request->ruangan_tujuan_id
                ]);
            } else {
                // Deduct partial stock
                $barang->decrement('jumlah', $request->jumlah);

                // Check if target room already has this item (by code/name)
                $targetBarang = Barang::where('ruangan_id', $request->ruangan_tujuan_id)
                    ->where('nama_barang', $barang->nama_barang)
                    ->first();

                if ($targetBarang) {
                    $targetBarang->increment('jumlah', $request->jumlah);
                } else {
                    // Create new item in the target room
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
                'message' => 'Mutasi barang berhasil diproses.',
                'data' => $mutasi,
                'code' => 201
            ];
        });

        if (! $result['success']) {
            return response()->json([
                'message' => $result['message']
            ], $result['code']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data']
        ], $result['code']);
    }
}

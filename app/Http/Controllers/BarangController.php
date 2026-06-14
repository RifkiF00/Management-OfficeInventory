<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangController extends Controller
{
    /**
     * Display a listing of inventory items with search and filter.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $ruanganId = $request->input('ruangan_id');
        $kondisi = $request->input('kondisi');

        $barangsQuery = Barang::with('ruangan');

        if ($search) {
            $barangsQuery->where(function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%");
            });
        }

        if ($ruanganId) {
            $barangsQuery->where('ruangan_id', $ruanganId);
        }

        if ($kondisi) {
            $barangsQuery->where('kondisi', $kondisi);
        }

        $barangs = $barangsQuery->get();
        $ruangans = Ruangan::all();

        return Inertia::render('Barang/Index', [
            'barangs' => $barangs,
            'ruangans' => $ruangans,
            'filters' => [
                'search' => $search,
                'ruangan_id' => $ruanganId,
                'kondisi' => $kondisi,
            ]
        ]);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        // Only admin can create
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat menambah data.');
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => 'required|string|max:50|unique:barang,kode_barang',
            'ruangan_id' => 'required|exists:ruangan,id',
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'jumlah' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
        ]);

        Barang::create([
            'nama_barang' => $request->nama_barang,
            'kode_barang' => $request->kode_barang,
            'ruangan_id' => $request->ruangan_id,
            'kondisi' => $request->kondisi,
            'jumlah' => $request->jumlah,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, Barang $barang)
    {
        // Only admin can update
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat mengubah data.');
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => 'required|string|max:50|unique:barang,kode_barang,' . $barang->id,
            'ruangan_id' => 'required|exists:ruangan,id',
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'jumlah' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
        ]);

        $barang->update([
            'nama_barang' => $request->nama_barang,
            'kode_barang' => $request->kode_barang,
            'ruangan_id' => $request->ruangan_id,
            'kondisi' => $request->kondisi,
            'jumlah' => $request->jumlah,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(Request $request, Barang $barang)
    {
        // Only admin can delete
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat menghapus data.');
        }

        $barang->delete();

        return redirect()->back()->with('success', 'Barang berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index()
    {
        $ruangans = Ruangan::all();

        return Inertia::render('Ruangan/Index', [
            'ruangans' => $ruangans
        ]);
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request)
    {
        // Only admin can create
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat menambah data.');
        }

        $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'kode_ruangan' => 'required|string|max:50|unique:ruangan,kode_ruangan',
        ]);

        Ruangan::create([
            'nama_ruangan' => $request->nama_ruangan,
            'kode_ruangan' => $request->kode_ruangan,
        ]);

        return redirect()->back()->with('success', 'Ruangan berhasil ditambahkan.');
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Ruangan $ruangan)
    {
        // Only admin can update
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat mengubah data.');
        }

        $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'kode_ruangan' => 'required|string|max:50|unique:ruangan,kode_ruangan,' . $ruangan->id,
        ]);

        $ruangan->update([
            'nama_ruangan' => $request->nama_ruangan,
            'kode_ruangan' => $request->kode_ruangan,
        ]);

        return redirect()->back()->with('success', 'Ruangan berhasil diperbarui.');
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Request $request, Ruangan $ruangan)
    {
        // Only admin can delete
        if ($request->user()->role !== 'admin') {
            return redirect()->back()->with('error', 'Akses ditolak. Hanya Admin yang dapat menghapus data.');
        }

        $ruangan->delete();

        return redirect()->back()->with('success', 'Ruangan berhasil dihapus.');
    }
}

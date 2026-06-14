<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index()
    {
        $barangs = Barang::with('ruangan')->get();

        return response()->json([
            'success' => true,
            'data' => $barangs
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ruangan;
use Illuminate\Http\Request;

class RuanganController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index()
    {
        $ruangans = Ruangan::get();

        return response()->json([
            'success' => true,
            'data' => $ruangans
        ]);
    }
}

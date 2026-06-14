<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengadaan extends Model
{
    protected $table = 'pengadaan';

    protected $fillable = [
        'nama_barang',
        'jumlah',
        'estimasi_harga',
        'status',
        'user_pemohon_id',
        'user_penyetuju_id',
        'tanggal_pengadaan',
        'keterangan',
    ];

    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_pemohon_id');
    }

    public function penyetuju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_penyetuju_id');
    }
}

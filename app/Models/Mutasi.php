<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mutasi extends Model
{
    protected $table = 'mutasi';

    protected $fillable = [
        'barang_id',
        'ruangan_asal_id',
        'ruangan_tujuan_id',
        'jumlah',
        'tanggal_mutasi',
        'keterangan',
        'user_id',
    ];

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class);
    }

    public function ruanganAsal(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_asal_id');
    }

    public function ruanganTujuan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_tujuan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

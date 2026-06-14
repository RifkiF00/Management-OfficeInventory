<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('staf'); // admin, staf, kepala
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. password_reset_tokens table (Required by Breeze)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 3. sessions table (Required by Breeze database sessions)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // 4. ruangan table
        Schema::create('ruangan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ruangan');
            $table->string('kode_ruangan')->unique();
            $table->timestamps();
        });

        // 5. barang table
        Schema::create('barang', function (Blueprint $table) {
            $table->id();
            $table->string('nama_barang');
            $table->string('kode_barang')->unique();
            $table->foreignId('ruangan_id')->constrained('ruangan')->cascadeOnDelete();
            $table->enum('kondisi', ['Baik', 'Rusak Ringan', 'Rusak Berat'])->default('Baik');
            $table->integer('jumlah');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // 6. mutasi table
        Schema::create('mutasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_id')->constrained('barang')->cascadeOnDelete();
            $table->foreignId('ruangan_asal_id')->constrained('ruangan')->cascadeOnDelete();
            $table->foreignId('ruangan_tujuan_id')->constrained('ruangan')->cascadeOnDelete();
            $table->integer('jumlah');
            $table->dateTime('tanggal_mutasi');
            $table->text('keterangan')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // 7. pengadaan table
        Schema::create('pengadaan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_barang');
            $table->integer('jumlah');
            $table->bigInteger('estimasi_harga');
            $table->enum('status', ['Diajukan', 'Disetujui', 'Ditolak'])->default('Diajukan');
            $table->foreignId('user_pemohon_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_penyetuju_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->dateTime('tanggal_pengadaan')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengadaan');
        Schema::dropIfExists('mutasi');
        Schema::dropIfExists('barang');
        Schema::dropIfExists('ruangan');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};

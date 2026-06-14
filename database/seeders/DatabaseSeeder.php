<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Ruangan;
use App\Models\Barang;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (3 roles)
        $admin = User::create([
            'name' => 'Admin Inventaris',
            'email' => 'admin@inventaris.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $staf = User::create([
            'name' => 'Staf Inventaris',
            'email' => 'staf@inventaris.com',
            'password' => Hash::make('password'),
            'role' => 'staf',
        ]);

        $kepala = User::create([
            'name' => 'Kepala Bagian',
            'email' => 'kepala@inventaris.com',
            'password' => Hash::make('password'),
            'role' => 'kepala',
        ]);

        // 2. Seed Rooms (Ruangans) - Segmented by actual corporate divisions
        $ruangIT = Ruangan::create([
            'nama_ruangan' => 'Ruang IT & Server',
            'kode_ruangan' => 'R001',
        ]);

        $ruangRapat = Ruangan::create([
            'nama_ruangan' => 'Ruang Rapat Utama',
            'kode_ruangan' => 'R002',
        ]);

        $ruangHRD = Ruangan::create([
            'nama_ruangan' => 'Ruang HRD',
            'kode_ruangan' => 'R003',
        ]);

        $ruangKepala = Ruangan::create([
            'nama_ruangan' => 'Ruang Kepala Divisi',
            'kode_ruangan' => 'R004',
        ]);

        $ruangMarketing = Ruangan::create([
            'nama_ruangan' => 'Ruang Marketing & Sales',
            'kode_ruangan' => 'R005',
        ]);

        $ruangKeuangan = Ruangan::create([
            'nama_ruangan' => 'Ruang Keuangan & Akuntansi',
            'kode_ruangan' => 'R006',
        ]);

        // 3. Seed Items (Barangs) - Mapped to corporate divisions

        // --- Ruang IT & Server (R001) ---
        Barang::create([
            'nama_barang' => 'Laptop ThinkPad L14',
            'kode_barang' => 'B001',
            'ruangan_id' => $ruangIT->id,
            'kondisi' => 'Baik',
            'jumlah' => 10,
            'deskripsi' => 'Laptop kerja pengembang perangkat lunak.',
        ]);

        Barang::create([
            'nama_barang' => 'Switch Cisco 24-Port',
            'kode_barang' => 'B002',
            'ruangan_id' => $ruangIT->id,
            'kondisi' => 'Baik',
            'jumlah' => 2,
            'deskripsi' => 'Switch distribusi jaringan utama.',
        ]);

        Barang::create([
            'nama_barang' => 'Printer HP LaserJet',
            'kode_barang' => 'B003',
            'ruangan_id' => $ruangIT->id,
            'kondisi' => 'Baik',
            'jumlah' => 2,
            'deskripsi' => 'Printer laser hitam putih kecepatan tinggi.',
        ]);

        // --- Ruang Rapat Utama (R002) ---
        Barang::create([
            'nama_barang' => 'Proyektor Epson EB-X05',
            'kode_barang' => 'B004',
            'ruangan_id' => $ruangRapat->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Proyektor presentasi ruang rapat utama.',
        ]);

        Barang::create([
            'nama_barang' => 'Meja Rapat Oval',
            'kode_barang' => 'B005',
            'ruangan_id' => $ruangRapat->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Meja kayu jati kapasitas 10 orang.',
        ]);

        Barang::create([
            'nama_barang' => 'Kursi Rapat Hidrolik',
            'kode_barang' => 'B006',
            'ruangan_id' => $ruangRapat->id,
            'kondisi' => 'Baik',
            'jumlah' => 12,
            'deskripsi' => 'Kursi rapat jaring dengan roda hidrolik.',
        ]);

        // --- Ruang HRD (R003) ---
        Barang::create([
            'nama_barang' => 'PC Desktop Dell Optiplex',
            'kode_barang' => 'B007',
            'ruangan_id' => $ruangHRD->id,
            'kondisi' => 'Baik',
            'jumlah' => 5,
            'deskripsi' => 'PC desktop untuk administrasi staf HRD.',
        ]);

        Barang::create([
            'nama_barang' => 'Lemari Arsip Besi',
            'kode_barang' => 'B008',
            'ruangan_id' => $ruangHRD->id,
            'kondisi' => 'Baik',
            'jumlah' => 3,
            'deskripsi' => 'Lemari arsip filing cabinet 4 laci pintu geser.',
        ]);

        // --- Ruang Kepala Divisi (R004) ---
        Barang::create([
            'nama_barang' => 'Meja Kerja Eksekutif',
            'kode_barang' => 'B009',
            'ruangan_id' => $ruangKepala->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Meja besar direksi dengan panel kayu jati.',
        ]);

        Barang::create([
            'nama_barang' => 'Kursi Direktur Kulit',
            'kode_barang' => 'B010',
            'ruangan_id' => $ruangKepala->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Kursi kulit hitam dengan sandaran kepala tinggi.',
        ]);

        Barang::create([
            'nama_barang' => 'Sofa Tamu Minimalis',
            'kode_barang' => 'B011',
            'ruangan_id' => $ruangKepala->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Sofa kulit hitam kapasitas 3 dudukan + meja kaca.',
        ]);

        Barang::create([
            'nama_barang' => 'AC Panasonic 1.5 PK',
            'kode_barang' => 'B012',
            'ruangan_id' => $ruangKepala->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Pendingin udara inverter hemat energi.',
        ]);

        // --- Ruang Marketing & Sales (R005) ---
        Barang::create([
            'nama_barang' => 'Meja Kerja Kubikel',
            'kode_barang' => 'B013',
            'ruangan_id' => $ruangMarketing->id,
            'kondisi' => 'Baik',
            'jumlah' => 8,
            'deskripsi' => 'Meja kubikel sekat dengan laci susun.',
        ]);

        Barang::create([
            'nama_barang' => 'Kursi Ergonomis Staf',
            'kode_barang' => 'B014',
            'ruangan_id' => $ruangMarketing->id,
            'kondisi' => 'Baik',
            'jumlah' => 8,
            'deskripsi' => 'Kursi kerja dengan sandaran punggung ergonomis.',
        ]);

        Barang::create([
            'nama_barang' => 'AC Split Daikin 2 PK',
            'kode_barang' => 'B015',
            'ruangan_id' => $ruangMarketing->id,
            'kondisi' => 'Baik',
            'jumlah' => 2,
            'deskripsi' => 'Pendingin ruangan utama area marketing.',
        ]);

        // --- Ruang Keuangan & Akuntansi (R006) ---
        Barang::create([
            'nama_barang' => 'Lemari Besi Brankas Uang',
            'kode_barang' => 'B016',
            'ruangan_id' => $ruangKeuangan->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Brankas besi tahan api untuk penyimpanan kas kecil.',
        ]);

        Barang::create([
            'nama_barang' => 'Kalkulator Digital Casio',
            'kode_barang' => 'B017',
            'ruangan_id' => $ruangKeuangan->id,
            'kondisi' => 'Baik',
            'jumlah' => 4,
            'deskripsi' => 'Kalkulator 12 digit untuk keperluan pembukuan.',
        ]);

        Barang::create([
            'nama_barang' => 'Dispenser Air Sharp',
            'kode_barang' => 'B018',
            'ruangan_id' => $ruangKeuangan->id,
            'kondisi' => 'Baik',
            'jumlah' => 1,
            'deskripsi' => 'Dispenser air galon bawah untuk staf divisi keuangan.',
        ]);
    }
}

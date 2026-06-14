# Sistem Informasi Inventaris Kantor 🏢📦

Aplikasi berbasis web modern untuk manajemen aset, inventaris, dan mutasi barang kantor secara terpusat. Proyek ini dirancang menggunakan arsitektur hybrid dengan **Laravel 12** sebagai Backend REST API dan penyedia data, serta **React.js + Inertia.js** sebagai Web Client Frontend. Selain itu, backend juga menyediakan **REST API JSON** (dengan autentikasi berbasis token **Laravel Sanctum**) yang siap digunakan oleh mobile client (Android Kotlin).

Proyek ini dikembangkan sebagai tugas praktikum **Modul 10 (Project Akhir)** untuk mensimulasikan sistem inventaris di lingkungan perkantoran nyata.

---

## ✨ Fitur Utama Sistem

1.  **📊 Dashboard Statistik Interaktif**: Menyajikan rekapitulasi data (total barang, ruangan, pengadaan aktif) serta visualisasi log transaksi mutasi barang terbaru.
2.  **🏢 Manajemen Ruangan (CRUD)**: Pengelolaan ruangan divisi/kantor secara dinamis dengan kode ruangan yang unik.
3.  **📦 Manajemen Barang Inventaris (CRUD)**: Pencatatan barang lengkap dengan pencarian, filter kondisi (Baik, Rusak Ringan, Rusak Berat), kuantitas, deskripsi, serta lokasi ruangan penempatan.
4.  **🔄 Transaksi Mutasi Barang**: Pengajuan perpindahan barang antar-ruangan oleh Staf, dan eksekusi mutasi langsung oleh Admin yang secara otomatis mengupdate stok ruangan asal dan tujuan secara aman melalui *database transactions*.
5.  **📋 Transaksi Pengadaan Baru**: Alur pengajuan pengadaan barang oleh Staf Kantor dan modul verifikasi (Persetujuan / Penolakan) secara langsung oleh Kepala Bagian.
6.  **📑 Modul Laporan & Cetak PDF**: Halaman rekapitulasi data barang dan log mutasi yang dilengkapi fitur ramah cetak (print-friendly) ke format PDF.
7.  **🔑 REST API Mobile Ready**: Endpoint API lengkap dan teramankan menggunakan Laravel Sanctum untuk diintegrasikan dengan aplikasi Android.

---

## 🛠️ Tech Stack

*   **Backend Framework**: Laravel 12 (PHP >= 8.2)
*   **Frontend Library**: React.js 19 (via Inertia.js)
*   **Styling & UI**: Tailwind CSS (Premium Dark/Light Glassmorphism theme)
*   **Database**: MySQL
*   **API Authentication**: Laravel Sanctum (Token-based)
*   **Development Server**: Laragon / XAMPP

---

## 📂 Panduan Instalasi & Setup Lengkap

Untuk instruksi langkah-demi-langkah cara menjalankan aplikasi di lingkungan lokal Anda (termasuk instalasi dependensi, migrasi database, dan pengujian API), silakan merujuk ke berkas berikut:

👉 **[BACA DI SINI: Panduan Setup Lengkap (setup.md)](file:///c:/laragon/www/Inventaris-Kantor/setup.md)**

---

## 🔑 Akun Uji Coba Bawaan (Default Seeded Users)

Semua akun dalam data seeder menggunakan kata sandi default: **`password`**

| Peran (Role) | Email | Wewenang & Akses |
| :--- | :--- | :--- |
| **Admin SARPRAS** | `admin@inventaris.com` | CRUD Ruangan & Barang, Eksekusi/Update Mutasi, Melihat Dashboard & Laporan, Cetak PDF |
| **Staf Kantor** | `staf@inventaris.com` | Mengajukan Mutasi & Pengadaan, Melihat Dashboard |
| **Kepala Bagian** | `kepala@inventaris.com` | Menyetujui/Menolak Pengadaan, Melihat Dashboard & Laporan, Cetak PDF |

---

## 📐 Matriks Akses Pengguna (Role Matrix)

| Fitur | Staf | Admin SARPRAS | Kepala Bagian |
| :--- | :---: | :---: | :---: |
| **Melihat Dashboard** | Ya | Ya | Ya |
| **Kelola Master Ruangan & Barang (CRUD)** | Tidak | **Ya** | Tidak |
| **Ajukan Mutasi / Pengadaan** | **Ya** | Ya | Tidak |
| **Eksekusi Mutasi (Update Stok)** | Tidak | **Ya** | Tidak |
| **Verifikasi Pengadaan (Approve/Reject)** | Tidak | Tidak | **Ya** |
| **Melihat Laporan & Cetak PDF** | Tidak | **Ya** | **Ya** |

---

## 📁 Struktur Direktori Utama Proyek

*   [`app/Models/`](file:///c:/laragon/www/Inventaris-Kantor/app/Models/) -> Model Eloquent (`User.php`, `Barang.php`, `Ruangan.php`, `Mutasi.php`, `Pengadaan.php`).
*   [`app/Http/Controllers/`](file:///c:/laragon/www/Inventaris-Kantor/app/Http/Controllers/) -> Controller web Inertia.
*   [`app/Http/Controllers/Api/`](file:///c:/laragon/www/Inventaris-Kantor/app/Http/Controllers/Api/) -> Controller REST API untuk aplikasi mobile.
*   [`database/migrations/`](file:///c:/laragon/www/Inventaris-Kantor/database/migrations/) -> Berkas migrasi database (disatukan dalam satu file migrasi terstruktur).
*   [`database/seeders/`](file:///c:/laragon/www/Inventaris-Kantor/database/seeders/) -> Seeder data uji coba awal.
*   [`routes/web.php`](file:///c:/laragon/www/Inventaris-Kantor/routes/web.php) -> Routing web utama (Inertia).
*   [`routes/api.php`](file:///c:/laragon/www/Inventaris-Kantor/routes/api.php) -> Routing REST API untuk mobile client.
*   [`resources/js/Pages/`](file:///c:/laragon/www/Inventaris-Kantor/resources/js/Pages/) -> Halaman utama aplikasi React (Barang, Ruangan, Mutasi, Pengadaan, Laporan).
*   [`blueprint.md`](file:///c:/laragon/www/Inventaris-Kantor/blueprint.md) -> Berkas arsitektur sistem dan desain awal ERD.

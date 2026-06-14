# Blueprint & Roadmap - Sistem Informasi Inventaris Kantor

Blueprint ini mendefinisikan arsitektur sistem, peran pengguna, spesifikasi antarmuka API, serta peta jalan (roadmap) langkah-demi-langkah pembangunan aplikasi **Inventaris Kantor** (Laravel 12 + React Inertia + REST API untuk Android Kotlin).

---

## 1. Arsitektur Sistem

Aplikasi ini menggunakan pendekatan hybrid:
- **Web Client (React.js + Inertia.js)**: Menyatu dalam repositori Laravel. Inertia menjembatani Controller Laravel langsung ke komponen React tanpa menulis REST API terpisah untuk web.
- **Mobile Client (Android Kotlin)**: Berdiri terpisah. Berkomunikasi dengan backend melalui **REST API JSON** (`routes/api.php`) dengan autentikasi berbasis token (**Laravel Sanctum**).
- **Database (MySQL)**: Satu database tunggal yang diakses bersama oleh web dan mobile.

```mermaid
graph TD
    %% Clients
    ReactWeb["Web Client (React + Inertia)"]
    KotlinMobile["Mobile Client (Android Kotlin)"]

    %% Backend Layers
    subgraph LaravelBackend["Laravel 12 Backend"]
        WebRoutes["web.php (Web Routes)"]
        ApiRoutes["api.php (REST API Routes)"]
        Controllers["Controllers (Business Logic)"]
        Sanctum["Laravel Sanctum (Token Auth)"]
        Eloquent["Eloquent ORM (Models)"]
    end

    %% Database
    MySQL[("MySQL Database (Laragon)")]

    %% Connections
    ReactWeb -->|Inertia Protocol| WebRoutes
    KotlinMobile -->|HTTP Requests + Token| Sanctum
    Sanctum --> ApiRoutes
    WebRoutes --> Controllers
    ApiRoutes --> Controllers
    Controllers --> Eloquent
    Eloquent --> MySQL
```

---

## 2. Desain Sistem (Use Case & ERD)

### A. Use Case Diagram
Diagram ini menjelaskan aktor dan cakupan fungsional sistem inventaris:

```mermaid
graph TD
    subgraph Aktor["Pengguna / Aktor"]
        Admin["Admin SARPRAS"]
        Staf["Staf Kantor"]
        Kepala["Kepala Bagian / Divisi"]
    end

    subgraph KasusPenggunaan["Use Cases (Sistem Inventaris)"]
        UC_Login("1. Login Akun")
        UC_Dashboard("2. Lihat Dashboard Stats")
        UC_CRUD_Ruangan("3. Kelola Ruangan (CRUD)")
        UC_CRUD_Barang("4. Kelola Barang (CRUD)")
        UC_Propose_Mutasi("5. Ajukan Mutasi Barang")
        UC_Propose_Pengadaan("6. Ajukan Pengadaan Baru")
        UC_Approve_Pengadaan("7. Verifikasi Pengadaan (Approve/Reject)")
        UC_Print_Laporan("8. Cetak Laporan PDF")
    end

    %% Koneksi
    Admin --> UC_Login
    Admin --> UC_Dashboard
    Admin --> UC_CRUD_Ruangan
    Admin --> UC_CRUD_Barang
    Admin --> UC_Propose_Mutasi
    Admin --> UC_Propose_Pengadaan
    Admin --> UC_Print_Laporan

    Staf --> UC_Login
    Staf --> UC_Dashboard
    Staf --> UC_Propose_Mutasi
    Staf --> UC_Propose_Pengadaan

    Kepala --> UC_Login
    Kepala --> UC_Dashboard
    Kepala --> UC_Approve_Pengadaan
    Kepala --> UC_Print_Laporan
```

### B. Entity-Relationship Diagram (ERD)
Hubungan antar tabel dalam database `db_inventaris_kantor`:

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email
        string password
        string role
        timestamp email_verified_at
        string remember_token
        timestamps timestamps
    }
    ruangan {
        bigint id PK
        string nama_ruangan
        string kode_ruangan
        timestamps timestamps
    }
    barang {
        bigint id PK
        string nama_barang
        string kode_barang UK
        bigint ruangan_id FK
        string kondisi
        integer jumlah
        text deskripsi
        timestamps timestamps
    }
    mutasi {
        bigint id PK
        bigint barang_id FK
        bigint ruangan_asal_id FK
        bigint ruangan_tujuan_id FK
        integer jumlah
        datetime tanggal_mutasi
        text keterangan
        bigint user_id FK
        timestamps timestamps
    }
    pengadaan {
        bigint id PK
        string nama_barang
        integer jumlah
        bigint estimasi_harga
        string status
        bigint user_pemohon_id FK
        bigint user_penyetuju_id FK
        datetime tanggal_pengadaan
        text keterangan
        timestamps timestamps
    }

    users ||--o{ mutasi : "melakukan"
    users ||--o{ pengadaan : "mengajukan/memeriksa"
    ruangan ||--o{ barang : "menampung"
    ruangan ||--o{ mutasi : "asal/tujuan"
    barang ||--o{ mutasi : "dimutasi"
```

---

## 3. Hak Akses & Matriks Peran (Role Matrix)

Sistem ini memiliki **3 peran utama** dengan batas otorisasi sebagai berikut:

| Fitur | Staf | Admin / Staf SARPRAS | Kepala Bagian |
| :--- | :---: | :---: | :---: |
| **Melihat Dashboard & Laporan** | Ya | Ya | Ya |
| **Mengelola Master Data (Barang, Ruangan)** | Tidak | **Ya (CRUD)** | Tidak |
| **Mengajukan Pengadaan Barang** | **Ya** | Ya | Tidak |
| **Menyetujui/Menolak Pengadaan** | Tidak | Tidak | **Ya (Approve/Reject)** |
| **Mengajukan Mutasi Barang** | **Ya** | Ya | Tidak |
| **Mengeksekusi Mutasi Barang** | Tidak | **Ya (Update Stok & Ruangan)** | Tidak |
| **Cetak/Export Laporan PDF** | Tidak | Ya | **Ya** |

---

## 4. Peta Jalan Pembangunan (Step-by-Step Roadmap)

### **Fase 1: Setup Lingkungan & Skema Database** (Selesai ✅)
- [x] Inisialisasi Laravel 12 + React (Inertia.js) + Tailwind CSS.
- [x] Konfigurasi `.env` ke database MySQL Laragon.
- [x] Membuat berkas migrasi tunggal `create_all_tables` untuk seluruh tabel.
- [x] Menyiapkan model (`Ruangan`, `Barang`, `Mutasi`, `Pengadaan`, `User`).
- [x] Menyiapkan `DatabaseSeeder` dengan 3 akun role default dan data awal.

### **Fase 2: Pembuatan API Backend (REST API untuk Kotlin)** (Selesai ✅)
- [x] **API Autentikasi** (`POST /api/login`, `POST /api/logout`).
- [x] **API Master Data** (`GET /api/barang`, `GET /api/ruangan`).
- [x] **API Transaksi Mutasi** (`POST /api/mutasi`).
- [x] **API Transaksi Pengadaan** (`GET /api/pengadaan`, `POST /api/pengadaan`).

### **Fase 3: Pembuatan Logika Bisnis & Controller Web (Inertia)** (Selesai ✅)
- [x] **RuanganController**: CRUD ruangan.
- [x] **BarangController**: CRUD barang beserta pencariannya.
- [x] **MutasiController**: Pengajuan mutasi & eksekusi mutasi (DB Transactions).
- [x] **PengadaanController**: Pengajuan pengadaan (Staf) & persetujuan (Kepala Bagian).
- [x] **LaporanController**: Mengolah rekap data barang dan mutasi siap cetak.

### **Fase 4: Pembangunan UI Web Frontend (React + Tailwind)** (Selesai ✅)
- [x] **Halaman Login**: Menyesuaikan tema visual agar terlihat modis dan modern.
- [x] **Halaman Dashboard**: Menampilkan ringkasan statistik (jumlah barang, ruangan, pengadaan aktif, grafik mutasi).
- [x] **Halaman CRUD Ruangan**: Tabel ruangan dengan modal tambah/edit/hapus.
- [x] **Halaman CRUD Barang**: Tabel barang dengan fitur pencarian, filter kondisi, dan modal tambah/edit/hapus.
- [x] **Halaman Pengadaan**: Form pengajuan pengadaan (untuk staf) dan daftar persetujuan tombol Terima/Tolak (untuk Kepala Bagian).
- [x] **Halaman Mutasi**: Form pemindahan barang antarkamar dan riwayat transaksi mutasi.
- [x] **Halaman Laporan**: Tampilan data laporan dengan tombol "Cetak PDF".

### **Fase 5: Pengujian Akhir & Dokumentasi** (Selesai ✅)
- [x] Pengujian relasi database dan pembatalan otomatis (*rollback*) transaksi jika terjadi error.
- [x] Memastikan hak akses (*role-based authorization*) berfungsi di setiap halaman dan API.
- [x] Menuliskan dokumentasi pengujian dalam berkas `walkthrough.md`.

# Panduan Setup & Dokumentasi Sistem Informasi Inventaris Kantor 🛠️🚀

Berkas ini menyediakan panduan lengkap untuk memasang (setup), menjalankan, dan menguji aplikasi **Inventaris Kantor** di lingkungan lokal Anda, serta dokumentasi REST API untuk integrasi dengan client mobile Android (Kotlin).

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan lingkungan pengembangan lokal Anda telah memenuhi spesifikasi berikut:
*   **PHP**: Versi >= 8.2 (Dilengkapi ekstensi `pdo`, `mbstring`, `openssl`, `xml`, `ctype`, `json`).
*   **Composer**: Package manager untuk PHP.
*   **Node.js**: Versi >= 18.x beserta **NPM**.
*   **Database Server**: MySQL (melalui Laragon, XAMPP, atau instalasi mandiri).
*   **Local Web Server**: Laragon (sangat direkomendasikan karena otomatisasi virtual host) atau Apache/Nginx bawaan XAMPP.

---

## ⚙️ Langkah Instalasi Lokal (Setup Steps)

Ikuti langkah-langkah berikut secara berurutan untuk menjalankan proyek di komputer Anda:

### 1. Letakkan Repositori di Folder Web Root
Pindahkan atau kloning folder proyek ini ke dalam folder root server lokal Anda:
*   Jika menggunakan Laragon: `C:\laragon\www\Inventaris-Kantor`
*   Jika menggunakan XAMPP: `C:\xampp\htdocs\Inventaris-Kantor`

### 2. Salin dan Konfigurasi Lingkungan (`.env`)
Buka terminal (CMD / PowerShell / Git Bash) di direktori root proyek, lalu salin berkas `.env.example` menjadi `.env`:
```bash
# Windows Command Prompt / PowerShell
copy .env.example .env

# Git Bash / Linux / macOS
cp .env.example .env
```
Setelah disalin, buka file `.env` dan sesuaikan kredensial database MySQL Anda. Contoh konfigurasi bawaan (Laragon/XAMPP):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_inventaris_kantor
DB_USERNAME=root
DB_PASSWORD=
```
*(Catatan: Buat database kosong bernama `db_inventaris_kantor` di phpMyAdmin atau DBMS pilihan Anda terlebih dahulu).*

### 3. Instal Dependensi Backend (PHP)
Jalankan perintah berikut untuk mengunduh semua library PHP yang dibutuhkan Laravel:
```bash
composer install
```

### 4. Hasilkan Kunci Aplikasi (Application Key Generation)
Jalankan perintah berikut untuk menghasilkan kunci enkripsi unik aplikasi Anda:
```bash
php artisan key:generate
```

### 5. Jalankan Migrasi & Pengisian Data Awal (Database Migration & Seeding)
Buat struktur tabel database serta isi data dummy (akun uji coba, ruangan awal, dan beberapa aset barang) menggunakan perintah:
```bash
php artisan migrate:fresh --seed
```

### 6. Instal Dependensi Frontend (JavaScript) & Jalankan Server Aset (Vite)
Unduh dependensi Node.js, kemudian jalankan server kompilasi frontend Vite agar halaman React dapat diakses secara dinamis:
```bash
# Instalasi library frontend
npm install

# Menjalankan Vite Dev Server (untuk development)
npm run dev
```
Jika Anda ingin mengompilasi aset untuk kebutuhan produksi (production build):
```bash
npm run build
```

---

## 🖥️ Akses Aplikasi Web

Setelah server web lokal aktif dan `npm run dev` berjalan, Anda dapat membuka browser dan mengakses:
*   Jika menggunakan Laragon: `http://inventaris-kantor.test`
*   Jika menggunakan XAMPP / PHP Server bawaan: `http://localhost:8000` (Jalankan `php artisan serve` di terminal terpisah jika menggunakan server bawaan).

### Kredensial Login Bawaan (Semua Sandi: `password`):
1.  **Admin SARPRAS**: `admin@inventaris.com`
2.  **Staf Kantor**: `staf@inventaris.com`
3.  **Kepala Bagian**: `kepala@inventaris.com`

---

## 📱 Dokumentasi REST API (Untuk Mobile Client Kotlin)

Backend menyediakan API JSON untuk diakses oleh aplikasi Android. Semua request wajib mengirimkan header berikut:
*   `Accept: application/json`
*   `Content-Type: application/json`

Untuk endpoint yang dilindungi autentikasi, sertakan header:
*   `Authorization: Bearer {YOUR_TOKEN_HERE}`

### 1. Autentikasi Pengguna

#### 🔑 Login Akun
*   **Method / URL**: `POST /api/login`
*   **Request Body**:
    ```json
    {
      "email": "staf@inventaris.com",
      "password": "password"
    }
    ```
*   **Response Sukses (200 OK)**:
    ```json
    {
      "token": "1|sOMEtOkEnStrIng...",
      "user": {
        "id": 2,
        "name": "Staf Kantor",
        "email": "staf@inventaris.com",
        "role": "staf"
      }
    }
    ```

#### 🔒 Logout Akun (Butuh Token)
*   **Method / URL**: `POST /api/logout`
*   **Response Sukses (200 OK)**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

### 2. Master Data (Butuh Token)

#### 📦 Ambil Daftar Seluruh Barang
*   **Method / URL**: `GET /api/barang`
*   **Response Sukses (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "nama_barang": "Laptop Dell Latitude",
        "kode_barang": "BRG-001",
        "ruangan_id": 1,
        "kondisi": "Baik",
        "jumlah": 5,
        "deskripsi": "Laptop dinas staf IT",
        "ruangan": {
          "id": 1,
          "nama_ruangan": "Ruang IT & Server",
          "kode_ruangan": "R-101"
        }
      }
    ]
    ```

#### 🏢 Ambil Daftar Seluruh Ruangan
*   **Method / URL**: `GET /api/ruangan`
*   **Response Sukses (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "nama_ruangan": "Ruang IT & Server",
        "kode_ruangan": "R-101"
      }
    ]
    ```

---

### 3. Transaksi Mutasi Barang (Butuh Token)

#### 🔄 Pengajuan Mutasi Barang Baru
*   **Method / URL**: `POST /api/mutasi`
*   **Request Body**:
    ```json
    {
      "barang_id": 1,
      "ruangan_asal_id": 1,
      "ruangan_tujuan_id": 2,
      "jumlah": 2,
      "keterangan": "Mutasi ke ruang administrasi"
    }
    ```
*   **Response Sukses (201 Created)**:
    ```json
    {
      "message": "Mutasi barang berhasil disimpan dan stok diperbarui.",
      "data": {
        "id": 5,
        "barang_id": 1,
        "ruangan_asal_id": 1,
        "ruangan_tujuan_id": 2,
        "jumlah": 2,
        "tanggal_mutasi": "2026-06-14 21:00:00",
        "keterangan": "Mutasi ke ruang administrasi",
        "user_id": 2
      }
    }
    ```
*(Catatan: Stok barang di ruangan asal akan dikurangi dan di ruangan tujuan akan ditambah secara otomatis melalui database transactions).*

---

### 4. Transaksi Pengadaan Barang (Butuh Token)

#### 📋 Ambil Daftar Pengadaan Barang
*   **Method / URL**: `GET /api/pengadaan`
*   **Response Sukses (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "nama_barang": "Proyektor Epson EB-X400",
        "jumlah": 2,
        "estimasi_harga": 14000000,
        "status": "Diajukan",
        "user_pemohon_id": 2,
        "tanggal_pengadaan": "2026-06-13T16:00:00.000000Z",
        "keterangan": "Untuk ruang rapat utama",
        "pemohon": {
          "id": 2,
          "name": "Staf Kantor"
        }
      }
    ]
    ```

#### ➕ Ajukan Pengadaan Barang Baru
*   **Method / URL**: `POST /api/pengadaan`
*   **Request Body**:
    ```json
    {
      "nama_barang": "Printer Canon G2010",
      "jumlah": 1,
      "estimasi_harga": 2300000,
      "keterangan": "Pengganti printer rusak di ruang admin"
    }
    ```
*   **Response Sukses (201 Created)**:
    ```json
    {
      "message": "Pengajuan pengadaan barang berhasil disimpan.",
      "data": {
        "id": 4,
        "nama_barang": "Printer Canon G2010",
        "jumlah": 1,
        "estimasi_harga": 2300000,
        "status": "Diajukan",
        "user_pemohon_id": 2,
        "keterangan": "Pengganti printer rusak di ruang admin",
        "tanggal_pengadaan": "2026-06-14T21:15:00.000000Z"
      }
    }
    ```

---

## 🛠️ Penyelesaian Masalah Umum (Troubleshooting)

Jika Anda menemui error saat menjalankan aplikasi, coba lakukan beberapa langkah pembersihan cache berikut:

*   **Error Perubahan Konfigurasi `.env`**:
    ```bash
    php artisan config:clear
    ```
*   **Error Routing / URL Tidak Ditemukan**:
    ```bash
    php artisan route:clear
    ```
*   **Menghapus Cache Session & Aplikasi**:
    ```bash
    php artisan cache:clear
    ```
*   **Mengulang Database dari Awal (Reset Database)**:
    ```bash
    php artisan migrate:fresh --seed
    ```
*   **Error Kompilasi Node/Vite (CSS tidak termuat)**:
    Pastikan `npm run dev` terus berjalan di terminal terpisah selama pengembangan, atau jalankan `npm run build` untuk memproduksi aset statis.

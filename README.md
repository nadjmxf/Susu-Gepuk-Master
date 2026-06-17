# SUGEP Master - Sistem Manajemen Penjualan Susu Online

[![Laravel 13.8](https://img.shields.io/badge/Laravel-13.8-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PHP 8.3](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Kontribusi](#kontribusi)
- [Support](#support)
- [Lisensi](#lisensi)

## 🎯 Tentang Proyek

**SUGEP Master** adalah platform manajemen penjualan susu online yang dirancang untuk mengelola penjualan produk susu melalui jaringan rider/penjual. Sistem ini memungkinkan admin untuk mengelola inventaris, mengelola rider, dan melacak penjualan secara real-time, sementara rider dapat melihat dashboard penjualan mereka dan mengelola status ketersediaan produk.

Platform ini dibangun dengan teknologi modern:
- **Backend**: Laravel 13.8 (PHP Framework)
- **Frontend**: React 19 dengan Vite (UI Framework)
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios untuk API communication

## ✨ Fitur Utama

### Untuk Admin
- 📊 Dashboard analitik penjualan dan inventaris
- 👥 Manajemen data rider dan outlet
- 🛍️ Manajemen produk susu dengan kategori dan harga
- 📈 Laporan penjualan dan revenue tracking
- 📢 Pengumuman operasional kepada rider
- 🔐 Autentikasi berbasis role (Admin/Rider)

### Untuk Rider
- 📱 Dashboard penjualan harian
- 🗺️ Live location tracking untuk menunjukkan ketersediaan produk
- 📦 Status produk real-time dengan stok dan barang basi
- 💰 Rekap pendapatan dan penjualan terkini
- 🔄 Sinkronisasi data otomatis dengan server

## 🔧 Persyaratan Sistem

### Backend Requirements
- PHP >= 8.3
- Composer
- MySQL 8.0+ atau SQLite
- Node.js (untuk asset compilation)

### Frontend Requirements
- Node.js >= 18.0
- npm atau yarn

### Development Tools
- Git
- VSCode atau editor pilihan Anda
- Postman (untuk testing API - optional)

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd Sugep_Master
```

### 2. Setup Backend

```bash
cd Backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations dan seeders
php artisan migrate:refresh --seed

# Start Laravel development server
php artisan serve
```

Server backend akan berjalan di `http://localhost:8000`

### 3. Setup Frontend

```bash
cd ../Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Server frontend akan berjalan di `http://localhost:5173`

### 4. Database Configuration

Edit file `.env` di folder Backend:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sugep_master
DB_USERNAME=root
DB_PASSWORD=
```

## ⚙️ Konfigurasi

### Environment Variables (Backend)

```env
APP_NAME=SuGepUK
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sugep_master
DB_USERNAME=root
DB_PASSWORD=

# API
API_URL=http://localhost:8000/api

# Session
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
```

### CORS Configuration (Frontend)

File `vite.config.js` sudah dikonfigurasi untuk proxy API requests ke backend:

```javascript
API_BASE_URL=http://localhost:8000/api
```

## 🚀 Penggunaan

### Login Admin

1. Buka `http://localhost:5173/admin/login`
2. Gunakan kredensial:
   - **Username**: admin
   - **Password**: password (atau sesuai seeder)

### Login Rider

1. Buka `http://localhost:5173/rider/login`
2. Gunakan kredensial dari database:
   - **Username**: rider username
   - **Password**: password (sesuai seeder)

### Mengakses Dashboard

- **Admin Dashboard**: `/admin/dashboard` (setelah login)
- **Rider Dashboard**: `/rider/dashboard` (setelah login)

### Testing API

```bash
# Get all menus
curl http://localhost:8000/api/menu

# Get rider by ID
curl http://localhost:8000/api/rider/1

# Get today's sales
curl http://localhost:8000/api/penjualan/rider/1/today
```

## 📁 Struktur Proyek

### Backend Structure
```
Backend/
├── app/
│   ├── Http/
│   │   └── Controllers/        # API Controllers
│   │       ├── AdminController.php
│   │       ├── RiderController.php
│   │       ├── MenuController.php
│   │       ├── PenjualanController.php
│   │       └── AuthController.php
│   └── Models/                 # Database Models
│       ├── Admin.php
│       ├── Rider.php
│       ├── Menu.php
│       ├── Penjualan.php
│       └── ...
├── database/
│   ├── migrations/             # Database schema
│   └── seeders/                # Data seeding
├── routes/
│   ├── api.php                 # API routes
│   └── web.php                 # Web routes
└── config/
    ├── database.php
    ├── auth.php
    └── cors.php
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── pages/
│   │   ├── admin/              # Admin pages
│   │   ├── rider/              # Rider pages
│   │   │   └── Dashboard.jsx   # Rider dashboard
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── components/             # Reusable components
│   ├── services/               # API services
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js      # Auth API
│   │   ├── riderService.js     # Rider API
│   │   ├── menuService.js      # Menu API
│   │   └── penjualanService.js # Sales API
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── public/                     # Static assets
└── index.html
```

## 🔌 API Endpoints

### Authentication
```
POST   /login/admin                    # Login admin
POST   /login/rider                    # Login rider
POST   /logout                         # Logout
```

### Rider Management
```
GET    /rider                          # List all riders
GET    /rider/{id}                     # Get rider details
POST   /rider                          # Create new rider
PUT    /rider/{id}                     # Update rider
DELETE /rider/{id}                     # Delete rider
GET    /rider/{id}/location            # Get rider location
PUT    /rider/{id}/location            # Update location status
GET    /rider/{id}/activity            # Get rider activity
```

### Menu (Products)
```
GET    /menu                           # List all menus
GET    /menu/{id}                      # Get menu details
POST   /menu                           # Create menu
PUT    /menu/{id}                      # Update menu
DELETE /menu/{id}                      # Delete menu
```

### Sales (Penjualan)
```
GET    /penjualan                      # List all sales
GET    /penjualan/{id}                 # Get sales details
POST   /penjualan                      # Create sales record
PUT    /penjualan/{id}                 # Update sales
DELETE /penjualan/{id}                 # Delete sales
GET    /penjualan/rider/{id}/today     # Get today's sales
GET    /penjualan/rider/{id}/latest    # Get latest sales
```

## 💾 Database Schema

### Core Tables

#### `riders`
```sql
- id_rider (PK)
- nama_rider
- foto_rider (nullable)
- no_hp
- username (unique)
- password
- status_akun (Aktif/Nonaktif)
- status_jualan (Tersedia/Habis)
- status_live_location (Aktif/Nonaktif)
- timestamps
```

#### `menus`
```sql
- id_menu (PK)
- id_admin (FK)
- nama_menu
- harga
- deskripsi (nullable)
- gambar_menu (nullable)
- kategori_menu (Outlet/SOTR/Keduanya)
- tag_menu (New/Best Seller)
- tanggal_tag_new (nullable)
- status_menu (Aktif/Nonaktif)
- timestamps
```

#### `penjualans`
```sql
- id_penjualan (PK)
- id_rider (FK)
- tanggal_penjualan
- jumlah_susu_basi
- jumlah_susu_rusak
- sisa_stok
- setoran_cash
- setoran_qris
- bukti_transfer (nullable)
- total_pendapatan
- jumlah_produk_terjual
- timestamps
```

#### `aktivitas`
```sql
- id_aktivitas (PK)
- id_rider (FK)
- tanggal_aktivitas
- status_aktivitas (Berjualan/Izin/Sakit/Tidak Ada Aktivitas)
- keterangan (nullable)
- created_at
```

## 🛠️ Development Commands

### Backend Commands
```bash
# Run server
php artisan serve

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Reset database dan seed
php artisan migrate:refresh --seed

# View routes
php artisan route:list

# Run tests
php artisan test
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📋 Workflow Autentikasi

1. **User Input Kredensial** → Login page (Admin/Rider)
2. **Validasi Kredensial** → POST `/login/admin` atau `/login/rider`
3. **Generate Token** → Backend return user data + token
4. **Store Token** → localStorage (token, user, role)
5. **Protected Routes** → Interceptor add token to headers
6. **Redirect** → Admin/Rider dashboard sesuai role

## 🔄 Data Flow

```
Frontend (React) 
    ↓
Axios Service Layer
    ↓
Backend API Routes
    ↓
Controllers
    ↓
Models + Database
    ↓
Response JSON
    ↓
Frontend State Update
```

## 🤝 Kontribusi

Kami menerima kontribusi untuk meningkatkan SUGEP Master. Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines
- Ikuti PSR-12 untuk backend (PHP)
- Gunakan ESLint config untuk frontend
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan

## 💬 Support

Jika Anda membutuhkan bantuan:

- 📧 **Email**: support@sugepmaster.local
- 📖 **Documentation**: Lihat folder `docs/` (jika ada)
- 🐛 **Report Bug**: Buat issue di repository
- 💡 **Feature Request**: Diskusi dalam issues

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

**Last Updated**: June 10, 2026  
**Version**: 1.0.0  
**Maintained by**: SUGEP Master Team


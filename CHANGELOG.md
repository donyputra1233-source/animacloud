# Changelog

Semua perubahan penting pada project ini akan dicatat dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan project ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-07-07

### 🚀 Fitur Baru
- **Rute API V2**: 50+ endpoint baru dengan fitur lanjutan
  - `/api/v2/anime` dengan filter lanjutan (genre, studio, season, status, format, minScore)
  - `/api/v2/anime/:id/relations` - Ambil relasi anime
  - `/api/v2/anime/:id/external` - Ambil link eksternal
  - `/api/v2/anime/:id/streaming` - Ambil link streaming
  - `/api/v2/anime/bulk` - Operasi massal (create/update/delete)
  - `/api/v2/anilist/search` - Pencarian lanjutan dengan filter
  - `/api/v2/anilist/filter` - Sistem filter lanjutan
  - `/api/v2/anilist/sync/batch` - Sinkronisasi massal multiple anime
  - `/api/v2/genres` - Daftar genre dengan statistik
  - `/api/v2/genres/popular` - Genre populer
  - `/api/v2/genres/search` - Cari genre
  - `/api/v2/statistics/dashboard` - Statistik dashboard
  - `/api/v2/statistics/anime` - Statistik anime
  - `/api/v2/statistics/genres` - Statistik genre
  - `/api/v2/sync/status` - Status sinkronisasi
  - `/api/v2/sync/logs` - Riwayat dengan filter

- **Method Anime Service V2**:
  - `getByIdWithRelations()` - Ambil anime dengan semua relasi
  - `advancedSearch()` - Pencarian lanjutan dengan multiple filter
  - `getRelations()` - Ambil relasi anime
  - `getExternalLinks()` - Ambil link eksternal
  - `getStreamingLinks()` - Ambil link streaming
  - `getFullStatistics()` - Statistik lengkap dengan genre, studio, season
  - `bulkOperation()` - Operasi massal create/update/delete
  - `getGenreStats()` - Statistik genre
  - `getStudioStats()` - Statistik studio
  - `getSeasonStats()` - Statistik season

- **Method AniList Service V2**:
  - `advancedSearch()` - Pencarian lanjutan dari AniList
  - `getFullDetail()` - Ambil detail lengkap anime
  - `getSuggestions()` - Ambil saran anime
  - `getAnimeByFilterV2()` - Filter anime dengan opsi lanjutan

- **Dukungan GraphQL**:
  - `src/graphql/queries.js` - Query GraphQL lengkap
  - `src/graphql/fragments.js` - Fragment GraphQL

- **Database**:
  - Tabel `external_links` - Menyimpan link eksternal
  - Tabel `streaming_links` - Menyimpan link streaming
  - File migrasi `migration-v2.0.0.sql`

- **Script**:
  - `sync-v2.js` - Sinkronisasi V2 dengan relasi
  - `migrate.js` - Migrasi database
  - `seed.js` - Seeder database

- **Dokumentasi**:
  - `README.md` - Dokumentasi lengkap V2
  - `CHANGELOG.md` - File ini

### 🔧 Perubahan
- **Response Format**: Menambahkan field `version` dan `apiVersion`
- **Pagination**: Object pagination baru dengan `hasNext`, `hasPrev`
- **Error Messages**: Pesan error lebih deskriptif
- **Cache System**: Dukungan Redis caching untuk performa
- **Logging**: Sistem logging dengan Winston

### 📝 Deprecasi
- Endpoint V1 akan dihapus pada v3.0.0
- Gunakan V2 untuk semua pengembangan baru

### 🐛 Perbaikan
- Rate limiting issues
- Memory leak pada proses sync
- Database connection timeout
- SSL certificate error pada tunnel Serveo

---

## [1.0.0] - 2026-01-01

### 🚀 Fitur Awal
- **Rilis perdana** Animacloud-API
- **30+ Endpoint API** dasar
- **Integrasi AniList** untuk data anime real-time
- **Sistem CRUD** untuk anime, genre, studio
- **Pencarian** anime dengan filter dasar
- **Sinkronisasi** trending, popular, seasonal
- **Database migration** awal
- **Dukungan** untuk XAMPP MySQL

### 🔧 Fitur yang Tersedia
- List anime dengan pagination
- Detail anime
- Search anime
- Trending anime
- Popular anime
- Latest anime
- Filter by genre
- Filter by studio
- Filter by season
- Episode list
- Characters list
- Staff list
- Recommendations
- Statistics
- AniList search
- AniList detail
- AniList trending
- AniList popular
- AniList seasonal
- Sync single anime
- Sync trending
- Sync popular
- Sync seasonal
- Sync all
- Genre list
- Genre detail
- Anime by genre

### 📁 Struktur Awal
- `src/config/` - Konfigurasi
- `src/controllers/` - Controller
- `src/models/` - Model database
- `src/routes/v1/` - Rute V1
- `src/services/` - Service layer
- `src/utils/` - Utility functions
- `database/migration.sql` - Database schema

---

## [0.1.0] - 2026-01-01

### 🚀 Inisialisasi Project
- Setup project Node.js + Express
- Struktur direktori awal
- Dependencies dasar
- Environment configuration
- Git setup

---

## 📊 Versi Mendatang

### [3.0.0] - Direncanakan
- **Fitur yang Direncanakan**:
  - GraphQL API
  - Autentikasi JWT
  - User management
  - Watchlist tracking
  - Review & rating system
  - Advanced analytics
  - Webhook support
  - Export data (CSV, JSON, XML)
  - Rate limiting per user
  - API key management

---

## 🏷️ Tag Release

| Versi | Tanggal | Link |
|-------|---------|------|
| v2.0.0 | 2026-07-07 | [Release v2.0.0](https://github.com/donyputra1233-source/animacloud/releases/tag/v2.0.0) |
| v1.0.0 | 2025-12-15 | [Release v1.1.0](https://github.com/donyputra1233-source/animacloud/releases/tag/v1.0.0) |


---

## 📝 Cara Berkontribusi ##

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 🚩 Informasi Tambahan ##
Api ini Masih Tahap Uji coba dan tidak disaran kan untuk jangka panjang untuk pertanyaan bisa ke arah contact owner

---
## 💬 Contact Owner
|Via | Link |
|:----:|:------:|
|github|[Click Here](https://github.com/donyputra1233-source)|
|email|[Chat Me](donyputra1233@gmail.com)

**Dibuat dengan ❤️ oleh Tim Aestra Src**
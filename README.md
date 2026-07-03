# 🔷 ANIMACLOUD-API 🔷
Animacloud-API adalah REST API untuk informasi Anime dari informasi detail, jadwal tayang serta lain sebagai nya

> Saat ini API ini sedang dalam Perkembangan, mungkin ini agak lama tapi akan segera diselesaikan secepat mungkin dan juga server ini belum stabil untuk saat ini

Link: https://animacloud.serveousercontent.com

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Version](https://img.shields.io/badge/version-1.0.0-red)
![deploy](https://badgen.net/memo/deployed)

## 🚀 Fitur

- **AniList Integration**: Mengambil data anime real-time dari AniList GraphQL API
- **Database Storage**: Menyimpan data anime, genre, studio, karakter, dan staff
- **Search & Filter**: Pencarian dan filter anime dengan berbagai parameter
- **Sync System**: Sinkronisasi data trending, popular, dan seasonal
- **RESTful API**: API yang terstruktur dengan versioning (V1)
- **Cache Support**: Redis caching untuk performa optimal (opsional)
- **Logging**: Sistem logging dengan Winston
- **Error Handling**: Error handling yang terstruktur

## 📚 Tech Stack Pengembangan Sementara

| Komponen | Teknologi |
|----------|-----------|
| Runtime | Node.js + Express.js |
| Database | MySQL (XAMPP) |
| API Source | AniList GraphQL API |
| Cache | Redis (Opsional) |
| Logging | Winston |
| Testing | Jest |
> Ini adalah Perangkat Pengembangan saat ini 

## 📦 List Version

| version | status | release |
|:---------:|:--------:|:---------:|
![API](https://img.shields.io/badge/api-v1-black)| Avaiable| ![date](https://img.shields.io/badge/release-03%20july%202026-green)|
![API](https://img.shields.io/badge/api-v2-white)|Coming soon| -|
![API](https://img.shields.io/badge/api-v3-magenta)|Coming soon| -|
## Paramenter

| Method | Endpoint | Deskripsi | Query Parameters | Contoh |
|:------:|:---------:|:----------:|:-----------------:|:-------|
| GET | /api/v1/anime | List semua anime dengan filter & pagination | page, limit, status, format, season, seasonYear, genre, search, minScore, maxScore, sortBy, sortOrder | GET /api/v1/anime?page=1&limit=10&status=RELEASING&genre=Action |
| GET | /api/v1/anime/:id | Detail anime berdasarkan ID | - | GET /api/v1/anime/1 |
| GET | /api/v1/anime/search | Pencarian anime | q (wajib), page, limit | GET /api/v1/anime/search?q=naruto&limit=5 |
| GET | /api/v1/anime/trending | Anime trending | limit | GET /api/v1/anime/trending?limit=10 |
| GET | /api/v1/anime/popular | Anime paling populer | limit | GET /api/v1/anime/popular?limit=10 |
| GET | /api/v1/anime/latest | Anime terbaru | limit | GET /api/v1/anime/latest?limit=10 |
| GET | /api/v1/anime/genre/:genre | Anime berdasarkan genre | page, limit | GET /api/v1/anime/genre/Action?page=1&limit=10 |
| GET | /api/v1/anime/studio/:studio | Anime berdasarkan studio | page, limit | GET /api/v1/anime/studio/Studio%20Pierrot |
| GET | /api/v1/anime/season/:season/:year | Anime berdasarkan season & tahun | limit | GET /api/v1/anime/season/SUMMER/2026?limit=10 |
| GET | /api/v1/anime/:id/episodes | Daftar episode anime | page, limit | GET /api/v1/anime/1/episodes?page=1&limit=50 |
| GET | /api/v1/anime/:id/characters | Daftar karakter anime | - | GET /api/v1/anime/1/characters |
| GET | /api/v1/anime/:id/staff | Daftar staff anime | - | GET /api/v1/anime/1/staff |
| GET | /api/v1/anime/:id/recommendations | Rekomendasi anime | - | GET /api/v1/anime/1/recommendations |
| GET | /api/v1/anime/:id/genres | Genre anime | - | GET /api/v1/anime/1/genres |
| GET | /api/v1/anime/:id/studios | Studio anime | - | GET /api/v1/anime/1/studios |
| GET | /api/v1/anime/statistics | Statistik anime | - | GET /api/v1/anime/statistics |

## Contoh Response

### Success Response
```json
{
    "success": true,
    "message": "Data berhasil diambil",
    "data": {
        "id": 1,
        "title": "Naruto",
        "description": "Naruto is a young shinobi...",
        "episodes": 220,
        "status": "FINISHED"
    },
    "timestamp": "2026-01-01T00:00:00.000Z"
}
```
### Success Pagination
```json
{
    "success": true,
    "message": "Data berhasil diambil",
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    },
    "timestamp": "2026-01-01T00:00:00.000Z"
}
```
### error Response
```json
{
    "success": false,
    "message": "Anime tidak ditemukan",
    "timestamp": "2026-01-01T00:00:00.000Z"
}
```
## HTTP ERROR
Tabel HTTP Status Codes

| Status Code | Deskripsi |
|-------------|-----------|
| 200 | Success - Request berhasil |
| 201 | Created - Data berhasil dibuat |
| 400 | Bad Request - Parameter tidak valid |
| 404 | Not Found - Data tidak ditemukan |
| 429 | Too Many Requests - Rate limit tercapai |
| 500 | Internal Server Error - Error server |


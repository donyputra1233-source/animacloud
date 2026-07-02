// src/routes/v2/index.js
const express = require('express');
const router = express.Router();

const animeController = require('../../controllers/animeController');
const anilistController = require('../../controllers/anilistController');
const genreController = require('../../controllers/genreController');
const syncController = require('../../controllers/syncController');

// ============================================
// ANIME ROUTES (Menengah)
// ============================================

// GET /api/v2/anime - List dengan filter lengkap
router.get('/anime', animeController.getAll);

// GET /api/v2/anime/:id - Detail dengan relations (genres, studios, characters, staff)
router.get('/anime/:id', animeController.getByIdWithRelations);

// GET /api/v2/anime/search - Search dengan filter
router.get('/anime/search', animeController.search);

// GET /api/v2/anime/trending - Trending anime
router.get('/anime/trending', animeController.getTrending);

// GET /api/v2/anime/popular - Popular anime
router.get('/anime/popular', animeController.getPopular);

// GET /api/v2/anime/latest - Latest anime
router.get('/anime/latest', animeController.getLatest);

// GET /api/v2/anime/genre/:genre - Anime by genre (dengan pagination)
router.get('/anime/genre/:genre', animeController.getByGenre);

// GET /api/v2/anime/studio/:studio - Anime by studio
router.get('/anime/studio/:studio', animeController.getByStudio);

// GET /api/v2/anime/season/:season/:year - Anime by season
router.get('/anime/season/:season/:year', animeController.getBySeason);

// GET /api/v2/anime/:id/episodes - Episode anime (dengan pagination)
router.get('/anime/:id/episodes', animeController.getEpisodes);

// GET /api/v2/anime/:id/characters - Characters anime
router.get('/anime/:id/characters', animeController.getCharacters);

// GET /api/v2/anime/:id/staff - Staff anime
router.get('/anime/:id/staff', animeController.getStaff);

// GET /api/v2/anime/:id/recommendations - Rekomendasi anime
router.get('/anime/:id/recommendations', animeController.getRecommendations);

// GET /api/v2/anime/:id/genres - Genres anime
router.get('/anime/:id/genres', animeController.getGenres);

// GET /api/v2/anime/:id/studios - Studios anime
router.get('/anime/:id/studios', animeController.getStudios);

// GET /api/v2/anime/statistics - Statistik anime
router.get('/anime/statistics', animeController.getStatistics);

// ============================================
// ANILIST ROUTES (Menengah)
// ============================================

// GET /api/v2/anilist/search - Search dengan offset
router.get('/anilist/search', anilistController.searchAnime);

// GET /api/v2/anilist/anime/:id - Detail lengkap
router.get('/anilist/anime/:id', anilistController.getAnimeDetail);

// GET /api/v2/anilist/trending - Trending dengan offset
router.get('/anilist/trending', anilistController.getTrendingAnime);

// GET /api/v2/anilist/popular - Popular dengan offset
router.get('/anilist/popular', anilistController.getPopularAnime);

// GET /api/v2/anilist/seasonal - Seasonal dengan offset
router.get('/anilist/seasonal', anilistController.getSeasonalAnime);

// GET /api/v2/anilist/filter - Filter anime (status, season, genre, rating)
router.get('/anilist/filter', anilistController.getAnimeByFilter);

// GET /api/v2/anilist/studio/:id - Detail studio
router.get('/anilist/studio/:id', anilistController.getStudioDetail);

// GET /api/v2/anilist/db/:id - Get dari database (auto-sync)
router.get('/anilist/db/:id', anilistController.getAnimeFromDB);

// ============================================
// GENRE ROUTES (Menengah)
// ============================================

// GET /api/v2/genres - List semua genre dengan count
router.get('/genres', genreController.getAll);

// GET /api/v2/genres/:id - Detail genre
router.get('/genres/:id', genreController.getById);

// GET /api/v2/genres/:id/anime - Anime by genre (dengan pagination)
router.get('/genres/:id/anime', genreController.getAnimeByGenre);

// ============================================
// SYNC ROUTES (Menengah)
// ============================================

// POST /api/v2/sync/:id - Sync single anime (dengan relations)
router.post('/sync/:id', syncController.syncAnime);

// POST /api/v2/sync/trending - Sync trending anime (batch)
router.post('/sync/trending', syncController.syncTrending);

// POST /api/v2/sync/popular - Sync popular anime (batch)
router.post('/sync/popular', syncController.syncPopular);

// POST /api/v2/sync/seasonal - Sync seasonal anime (batch)
router.post('/sync/seasonal', syncController.syncSeasonal);

// GET /api/v2/sync/logs - Lihat history sync
router.get('/sync/logs', syncController.getSyncLogs);

// GET /api/v2/sync/logs/:id - Detail sync log
router.get('/sync/logs/:id', syncController.getSyncLog);

module.exports = router;
// src/routes/v1/anilistRoutes.js
const express = require('express');
const router = express.Router();
const anilistController = require('../../controllers/anilistController');

// ============================================
// ANILIST ROUTES V1
// ============================================

// GET /api/v1/anilist/search - Search anime dari AniList
router.get('/search', anilistController.searchAnime);

// GET /api/v1/anilist/anime/:id - Detail anime dari AniList
router.get('/anime/:id', anilistController.getAnimeDetail);

// GET /api/v1/anilist/trending - Trending anime dari AniList
router.get('/trending', anilistController.getTrendingAnime);

// GET /api/v1/anilist/popular - Popular anime dari AniList
router.get('/popular', anilistController.getPopularAnime);

// GET /api/v1/anilist/seasonal - Seasonal anime dari AniList
router.get('/seasonal', anilistController.getSeasonalAnime);

// GET /api/v1/anilist/filter - Filter anime dari AniList
router.get('/filter', anilistController.getAnimeByFilter);

// GET /api/v1/anilist/studio/:id - Detail studio dari AniList
router.get('/studio/:id', anilistController.getStudioDetail);

// GET /api/v1/anilist/db/:id - Get dari database (auto-sync)
router.get('/db/:id', anilistController.getAnimeFromDB);

// POST /api/v1/anilist/sync/:id - Sync single anime
router.post('/sync/:id', anilistController.syncAnime);

module.exports = router;
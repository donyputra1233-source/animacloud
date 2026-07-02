// src/routes/v1/animeRoutes.js
const express = require('express');
const router = express.Router();
const animeController = require('../../controllers/animeController');

// ============================================
// ANIME ROUTES V1
// ============================================

// GET /api/v1/anime - List semua anime (dengan filter & pagination)
router.get('/', animeController.getAll);

// GET /api/v1/anime/statistics - Statistik anime
router.get('/statistics', animeController.getStatistics);

// GET /api/v1/anime/search - Search anime
router.get('/search', animeController.search);

// GET /api/v1/anime/trending - Trending anime
router.get('/trending', animeController.getTrending);

// GET /api/v1/anime/popular - Popular anime
router.get('/popular', animeController.getPopular);

// GET /api/v1/anime/latest - Latest anime
router.get('/latest', animeController.getLatest);

// GET /api/v1/anime/genre/:genre - Anime by genre
router.get('/genre/:genre', animeController.getByGenre);

// GET /api/v1/anime/studio/:studio - Anime by studio
router.get('/studio/:studio', animeController.getByStudio);

// GET /api/v1/anime/season/:season/:year - Anime by season
router.get('/season/:season/:year', animeController.getBySeason);

// GET /api/v1/anime/:id - Detail anime
router.get('/:id', animeController.getById);

// GET /api/v1/anime/:id/episodes - Episode anime
router.get('/:id/episodes', animeController.getEpisodes);

// GET /api/v1/anime/:id/characters - Characters anime
router.get('/:id/characters', animeController.getCharacters);

// GET /api/v1/anime/:id/staff - Staff anime
router.get('/:id/staff', animeController.getStaff);

// GET /api/v1/anime/:id/recommendations - Rekomendasi anime
router.get('/:id/recommendations', animeController.getRecommendations);

// GET /api/v1/anime/:id/genres - Genres anime
router.get('/:id/genres', animeController.getGenres);

// GET /api/v1/anime/:id/studios - Studios anime
router.get('/:id/studios', animeController.getStudios);

module.exports = router;
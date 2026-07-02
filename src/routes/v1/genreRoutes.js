// src/routes/v1/genreRoutes.js
const express = require('express');
const router = express.Router();
const genreController = require('../../controllers/genreController');

// ============================================
// GENRE ROUTES V1
// ============================================

// GET /api/v1/genres - List semua genre
router.get('/', genreController.getAll);

// GET /api/v1/genres/:id - Detail genre
router.get('/:id', genreController.getById);

// GET /api/v1/genres/:id/anime - Anime by genre
router.get('/:id/anime', genreController.getAnimeByGenre);

module.exports = router;
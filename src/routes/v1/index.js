// src/routes/v1/index.js
const express = require('express');
const router = express.Router();

const animeRoutes = require('./animeRoutes');
const anilistRoutes = require('./anilistRoutes');
const genreRoutes = require('./genreRoutes');
const syncRoutes = require('./syncRoutes');

// ============================================
// ROUTES V1
// ============================================

// Anime routes (database)
router.use('/anime', animeRoutes);

// AniList routes (API)
router.use('/anilist', anilistRoutes);

// Genre routes
router.use('/genres', genreRoutes);

// Sync routes
router.use('/sync', syncRoutes);

// V1 Info
router.get('/', (req, res) => {
    res.json({
        version: 'v1',
        name: 'Animacloud-API',
        description: 'Anime Information API - Basic Version',
        endpoints: {
            anime: '/api/v1/anime',
            anilist: '/api/v1/anilist',
            genres: '/api/v1/genres',
            sync: '/api/v1/sync'
        }
    });
});

module.exports = router;
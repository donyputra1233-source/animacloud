// src/routes/v2/index.js
const express = require('express');
const router = express.Router();

const animeController = require('../../controllers/animeController');
const anilistController = require('../../controllers/anilistController');
const genreController = require('../../controllers/genreController');
const syncController = require('../../controllers/syncController');

// Fallback handler untuk mencegah crash saat controller method belum tersedia
const mustFn = (fn, label) => {
    if (typeof fn === 'function') return fn;
    return (req, res) => res.status(501).json({
        success: false,
        message: `Handler not implemented${label ? `: ${label}` : ''}`
    });
};


// ============================================
// V2 INFO
// ============================================
router.get('/', (req, res) => {
    res.json({
        version: 'v2.0.0',
        name: 'Animacloud-API',
        description: 'Anime Information API - Advanced Version',
        features: [
            'Advanced filtering',
            'Batch sync',
            'Relations (characters, staff, recommendations)',
            'Statistics dashboard',
            'Cache support'
        ],
        endpoints: {
            anime: '/api/v2/anime',
            anilist: '/api/v2/anilist',
            genres: '/api/v2/genres',
            sync: '/api/v2/sync',
            statistics: '/api/v2/statistics'
        }
    });
});

// ============================================
// ANIME ROUTES V2
// ============================================

// GET /api/v2/anime - List dengan filter advanced
router.get('/anime', mustFn(animeController.getAll, 'anime.getAll'));


// GET /api/v2/anime/:id - Detail dengan relations
router.get('/anime/:id', animeController.getByIdWithRelations);

// GET /api/v2/anime/search - Advanced search
router.get('/anime/search', animeController.advancedSearch);

// GET /api/v2/anime/trending - Trending with period
router.get('/anime/trending', animeController.getTrending);

// GET /api/v2/anime/popular - Popular with filter
router.get('/anime/popular', animeController.getPopular);

// GET /api/v2/anime/latest - Latest with filter
router.get('/anime/latest', animeController.getLatest);

// GET /api/v2/anime/genre/:genre - Anime by genre (advanced)
router.get('/anime/genre/:genre', animeController.getByGenreAdvanced);

// GET /api/v2/anime/studio/:studio - Anime by studio (advanced)
router.get('/anime/studio/:studio', animeController.getByStudioAdvanced);

// GET /api/v2/anime/season/:season/:year - Anime by season (advanced)
router.get('/anime/season/:season/:year', animeController.getBySeasonAdvanced);

// GET /api/v2/anime/:id/episodes - Episodes with filter
router.get('/anime/:id/episodes', animeController.getEpisodes);

// GET /api/v2/anime/:id/characters - Characters with detail
router.get('/anime/:id/characters', animeController.getCharacters);

// GET /api/v2/anime/:id/staff - Staff with detail
router.get('/anime/:id/staff', animeController.getStaff);

// GET /api/v2/anime/:id/recommendations - Recommendations with score
router.get('/anime/:id/recommendations', animeController.getRecommendations);

// GET /api/v2/anime/:id/relations - Relations
router.get('/anime/:id/relations', animeController.getRelations);

// GET /api/v2/anime/:id/external - External links
router.get('/anime/:id/external', animeController.getExternalLinks);

// GET /api/v2/anime/:id/streaming - Streaming links
router.get('/anime/:id/streaming', animeController.getStreamingLinks);

// GET /api/v2/anime/statistics - Full statistics
router.get('/anime/statistics', animeController.getFullStatistics);

// POST /api/v2/anime/bulk - Bulk insert/update
router.post('/anime/bulk', animeController.bulkOperation);

// ============================================
// ANILIST ROUTES V2
// ============================================

// GET /api/v2/anilist/search - Advanced search
router.get('/anilist/search', anilistController.advancedSearch);

// GET /api/v2/anilist/anime/:id - Full detail
router.get('/anilist/anime/:id', anilistController.getFullDetail);

// GET /api/v2/anilist/trending - Trending with period
router.get('/anilist/trending', anilistController.getTrendingAdvanced);

// GET /api/v2/anilist/popular - Popular with filter
router.get('/anilist/popular', anilistController.getPopularAdvanced);

// GET /api/v2/anilist/seasonal - Seasonal with filter
router.get('/anilist/seasonal', anilistController.getSeasonalAdvanced);

// GET /api/v2/anilist/filter - Advanced filter
router.get('/anilist/filter', anilistController.advancedFilter);

// GET /api/v2/anilist/studio/:id - Full studio detail
router.get('/anilist/studio/:id', anilistController.getStudioFullDetail);

// GET /api/v2/anilist/genre/:genre - Anime by genre from AniList
router.get('/anilist/genre/:genre', anilistController.getByGenreFromAnilist);

// GET /api/v2/anilist/suggestions - Anime suggestions
router.get('/anilist/suggestions', anilistController.getSuggestions);

// GET /api/v2/anilist/db/:id - Get from database with sync
router.get('/anilist/db/:id', anilistController.getAnimeFromDBSync);

// POST /api/v2/anilist/sync/:id - Sync full with relations
router.post('/anilist/sync/:id', anilistController.syncAnimeFull);

// POST /api/v2/anilist/sync/batch - Batch sync
router.post('/anilist/sync/batch', anilistController.syncAnimeBatch);

// ============================================
// GENRE ROUTES V2
// ============================================

// GET /api/v2/genres - List with statistics
router.get('/genres', genreController.getAllWithStats);

// GET /api/v2/genres/:id - Detail with anime
router.get('/genres/:id', genreController.getByIdWithAnime);

// GET /api/v2/genres/:id/anime - Anime by genre (advanced)
router.get('/genres/:id/anime', genreController.getAnimeByGenreAdvanced);

// GET /api/v2/genres/popular - Popular genres
router.get('/genres/popular', genreController.getPopularGenres);

// GET /api/v2/genres/search - Search genres
router.get('/genres/search', genreController.searchGenres);

// ============================================
// SYNC ROUTES V2
// ============================================

// POST /api/v2/sync/:id - Sync full
router.post('/sync/:id', syncController.syncAnimeFull);

// POST /api/v2/sync/trending - Sync trending with config
router.post('/sync/trending', syncController.syncTrendingAdvanced);

// POST /api/v2/sync/popular - Sync popular with config
router.post('/sync/popular', syncController.syncPopularAdvanced);

// POST /api/v2/sync/seasonal - Sync seasonal with config
router.post('/sync/seasonal', syncController.syncSeasonalAdvanced);

// POST /api/v2/sync/all - Sync all with config
router.post('/sync/all', syncController.syncAllAdvanced);

// GET /api/v2/sync/logs - History with filter
router.get('/sync/logs', syncController.getSyncLogsAdvanced);

// GET /api/v2/sync/status - Sync status
router.get('/sync/status', syncController.getSyncStatus);

// ============================================
// STATISTICS ROUTES V2
// ============================================

// GET /api/v2/statistics/dashboard - Dashboard stats
router.get('/statistics/dashboard', animeController.getDashboardStats);

// GET /api/v2/statistics/anime - Anime statistics
router.get('/statistics/anime', animeController.getAnimeStats);

// GET /api/v2/statistics/genres - Genre statistics
router.get('/statistics/genres', animeController.getGenreStats);


module.exports = router;
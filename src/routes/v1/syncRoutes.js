// src/routes/v1/syncRoutes.js
const express = require('express');
const router = express.Router();
const syncController = require('../../controllers/syncController');

// ============================================
// SYNC ROUTES V1
// ============================================

// POST /api/v1/sync/trending - Sync trending anime
router.post('/trending', syncController.syncTrending);

// POST /api/v1/sync/popular - Sync popular anime
router.post('/popular', syncController.syncPopular);

// POST /api/v1/sync/seasonal - Sync seasonal anime
router.post('/seasonal', syncController.syncSeasonal);

// POST /api/v1/sync/all - Sync semua
router.post('/all', syncController.syncAll);

// GET /api/v1/sync/logs - History sync
router.get('/logs', syncController.getSyncLogs);

// GET /api/v1/sync/logs/:id - Detail sync log
router.get('/logs/:id', syncController.getSyncLog);

module.exports = router;
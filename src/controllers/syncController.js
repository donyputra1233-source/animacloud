// src/controllers/syncController.js
const syncService = require('../services/syncService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class SyncController {
    // === SYNC TRENDING ===
    async syncTrending(req, res, next) {
        try {
            const { limit = 20 } = req.query;
            const result = await syncService.syncTrending(parseInt(limit));
            res.status(200).json(successResponse('Sync trending anime berhasil', result));
        } catch (error) {
            next(error);
        }
    }

    // === SYNC POPULAR ===
    async syncPopular(req, res, next) {
        try {
            const { limit = 20 } = req.query;
            const result = await syncService.syncPopular(parseInt(limit));
            res.status(200).json(successResponse('Sync popular anime berhasil', result));
        } catch (error) {
            next(error);
        }
    }

    // === SYNC SEASONAL ===
    async syncSeasonal(req, res, next) {
        try {
            const { year, season, limit = 20 } = req.query;
            if (!year || !season) {
                return res.status(400).json(errorResponse('Parameter "year" dan "season" wajib diisi'));
            }
            const result = await syncService.syncSeasonal(parseInt(year), season, parseInt(limit));
            res.status(200).json(successResponse('Sync seasonal anime berhasil', result));
        } catch (error) {
            next(error);
        }
    }

    // === SYNC ALL ===
    async syncAll(req, res, next) {
        try {
            const { limit = 20 } = req.query;
            const result = await syncService.syncAll(parseInt(limit));
            res.status(200).json(successResponse('Sync semua anime berhasil', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET SYNC LOGS ===
    async getSyncLogs(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const result = await syncService.getSyncLogs(parseInt(limit));
            res.status(200).json(successResponse('History sync', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET SYNC LOG BY ID ===
    async getSyncLog(req, res, next) {
        try {
            const { id } = req.params;
            const result = await syncService.getSyncLog(id);
            if (!result) {
                return res.status(404).json(errorResponse('Sync log tidak ditemukan'));
            }
            res.status(200).json(successResponse('Detail sync log', result));
        } catch (error) {
            next(error);
        }
    }
}
// src/controllers/syncController.js
// Tambahkan method V2 di akhir file, sebelum module.exports

// === V2: SYNC ANIME FULL ===
const syncAnimeFull = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { includeRelations = true } = req.query;
        const result = await syncService.syncAnimeFull(id, includeRelations === 'true');
        if (!result) {
            return res.status(404).json(errorResponse('Anime tidak ditemukan'));
        }
        res.status(200).json(successResponse('Sync anime full completed', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SYNC TRENDING ADVANCED ===
const syncTrendingAdvanced = async (req, res, next) => {
    try {
        const { limit = 20, includeRelations = false } = req.query;
        const result = await syncService.syncTrending(parseInt(limit), includeRelations === 'true');
        res.status(200).json(successResponse('Sync trending advanced completed', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SYNC POPULAR ADVANCED ===
const syncPopularAdvanced = async (req, res, next) => {
    try {
        const { limit = 20, includeRelations = false } = req.query;
        const result = await syncService.syncPopular(parseInt(limit), includeRelations === 'true');
        res.status(200).json(successResponse('Sync popular advanced completed', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SYNC SEASONAL ADVANCED ===
const syncSeasonalAdvanced = async (req, res, next) => {
    try {
        const { year, season, limit = 20, includeRelations = false } = req.query;
        if (!year || !season) {
            return res.status(400).json(errorResponse('Parameter "year" dan "season" wajib diisi'));
        }
        const result = await syncService.syncSeasonal(parseInt(year), season, parseInt(limit), includeRelations === 'true');
        res.status(200).json(successResponse('Sync seasonal advanced completed', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SYNC ALL ADVANCED ===
const syncAllAdvanced = async (req, res, next) => {
    try {
        const { limit = 20, includeRelations = false } = req.query;
        const result = await syncService.syncAll(parseInt(limit), includeRelations === 'true');
        res.status(200).json(successResponse('Sync all advanced completed', result));
    } catch (error) {
        next(error);
    }
};

// === V2: GET SYNC LOGS ADVANCED ===
const getSyncLogsAdvanced = async (req, res, next) => {
    try {
        const { limit = 10, status, syncType } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (syncType) filters.syncType = syncType;
        const result = await syncService.getSyncLogs(filters, parseInt(limit));
        res.status(200).json(successResponse('Sync logs', result));
    } catch (error) {
        next(error);
    }
};

// === V2: GET SYNC STATUS ===
const getSyncStatus = async (req, res, next) => {
    try {
        const status = await syncService.getStatus();
        res.status(200).json(successResponse('Sync status', status));
    } catch (error) {
        next(error);
    }
};

const controller = new SyncController();

// Attach V2 methods to controller
controller.syncAnimeFull = syncAnimeFull;
controller.syncTrendingAdvanced = syncTrendingAdvanced;
controller.syncPopularAdvanced = syncPopularAdvanced;
controller.syncSeasonalAdvanced = syncSeasonalAdvanced;
controller.syncAllAdvanced = syncAllAdvanced;
controller.getSyncLogsAdvanced = getSyncLogsAdvanced;
controller.getSyncStatus = getSyncStatus;

module.exports = controller;
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

module.exports = new SyncController();
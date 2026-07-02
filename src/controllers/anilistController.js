// src/controllers/anilistController.js
const anilistService = require('../services/anilistService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AnilistController {
    // === SEARCH ANIME ===
    async searchAnime(req, res, next) {
        try {
            const { q, limit = 10, offset = 0 } = req.query;
            if (!q) {
                return res.status(400).json(errorResponse('Parameter "q" wajib diisi'));
            }
            const result = await anilistService.searchAnime(q, parseInt(limit), parseInt(offset));
            res.status(200).json(successResponse('Hasil pencarian dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET ANIME DETAIL ===
    async getAnimeDetail(req, res, next) {
        try {
            const { id } = req.params;
            const result = await anilistService.getAnimeDetail(id);
            if (!result) {
                return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
            }
            res.status(200).json(successResponse('Detail anime dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET TRENDING ===
    async getTrendingAnime(req, res, next) {
        try {
            const { limit = 10, offset = 0 } = req.query;
            const result = await anilistService.getTrending(parseInt(limit), parseInt(offset));
            res.status(200).json(successResponse('Trending anime dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET POPULAR ===
    async getPopularAnime(req, res, next) {
        try {
            const { limit = 10, offset = 0 } = req.query;
            const result = await anilistService.getPopular(parseInt(limit), parseInt(offset));
            res.status(200).json(successResponse('Popular anime dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET SEASONAL ===
    async getSeasonalAnime(req, res, next) {
        try {
            const { year, season, limit = 10, offset = 0 } = req.query;
            if (!year || !season) {
                return res.status(400).json(errorResponse('Parameter "year" dan "season" wajib diisi'));
            }
            const result = await anilistService.getSeasonal(season, parseInt(year), parseInt(limit), parseInt(offset));
            res.status(200).json(successResponse('Seasonal anime dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET BY FILTER ===
    async getAnimeByFilter(req, res, next) {
        try {
            const { status, season, seasonYear, genres, rating, year, ageRating, limit = 10, offset = 0 } = req.query;
            const filters = {};
            if (status) filters.status = status;
            if (season) filters.season = season;
            if (seasonYear) filters.seasonYear = parseInt(seasonYear);
            if (genres) filters.genres = genres;
            if (rating) filters.rating = parseInt(rating);
            if (year) filters.year = parseInt(year);
            if (ageRating) filters.ageRating = ageRating;
            
            const result = await anilistService.getAnimeByFilter(filters, parseInt(limit), parseInt(offset));
            res.status(200).json(successResponse('Filtered anime dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET STUDIO DETAIL ===
    async getStudioDetail(req, res, next) {
        try {
            const { id } = req.params;
            const result = await anilistService.getStudio(id);
            if (!result) {
                return res.status(404).json(errorResponse('Studio tidak ditemukan di AniList'));
            }
            res.status(200).json(successResponse('Detail studio dari AniList', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET ANIME FROM DATABASE (AUTO-SYNC) ===
    async getAnimeFromDB(req, res, next) {
        try {
            const { id } = req.params;
            const result = await anilistService.syncAnimeToDatabase(id);
            if (!result) {
                return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
            }
            res.status(200).json(successResponse('Anime dari database (auto-sync)', result));
        } catch (error) {
            next(error);
        }
    }

    // === SYNC ANIME ===
    async syncAnime(req, res, next) {
        try {
            const { id } = req.params;
            const { includeRelations = false } = req.query;
            const result = await anilistService.syncAnimeToDatabase(id, includeRelations === 'true');
            if (!result) {
                return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
            }
            res.status(200).json(successResponse('Anime berhasil disinkronkan', result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AnilistController();
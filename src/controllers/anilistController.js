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
// src/controllers/anilistController.js
// Tambahkan method V2 di akhir file, sebelum module.exports

// === V2: ADVANCED SEARCH ===
const advancedSearch = async (req, res, next) => {
    try {
        const { q, limit = 10, offset = 0, genre, status, format } = req.query;
        if (!q) {
            return res.status(400).json(errorResponse('Parameter "q" wajib diisi'));
        }
        const filters = { search: q, genre, status, format };
        const result = await anilistService.advancedSearch(filters, parseInt(limit), parseInt(offset));
        res.status(200).json(successResponse('Advanced search results from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: FULL DETAIL ===
const getFullDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await anilistService.getFullDetail(id);
        if (!result) {
            return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
        }
        res.status(200).json(successResponse('Full detail from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: TRENDING ADVANCED ===
const getTrendingAdvanced = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const result = await anilistService.getTrending(parseInt(limit), parseInt(offset));
        res.status(200).json(successResponse('Trending anime from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: POPULAR ADVANCED ===
const getPopularAdvanced = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const result = await anilistService.getPopular(parseInt(limit), parseInt(offset));
        res.status(200).json(successResponse('Popular anime from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SEASONAL ADVANCED ===
const getSeasonalAdvanced = async (req, res, next) => {
    try {
        const { year, season, limit = 10, offset = 0 } = req.query;
        if (!year || !season) {
            return res.status(400).json(errorResponse('Parameter "year" dan "season" wajib diisi'));
        }
        const result = await anilistService.getSeasonal(season, parseInt(year), parseInt(limit), parseInt(offset));
        res.status(200).json(successResponse('Seasonal anime from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: ADVANCED FILTER ===
const advancedFilter = async (req, res, next) => {
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
        res.status(200).json(successResponse('Advanced filter results from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: STUDIO FULL DETAIL ===
const getStudioFullDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await anilistService.getStudio(id);
        if (!result) {
            return res.status(404).json(errorResponse('Studio tidak ditemukan di AniList'));
        }
        res.status(200).json(successResponse('Studio full detail from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: GET BY GENRE FROM ANILIST ===
const getByGenreFromAnilist = async (req, res, next) => {
    try {
        const { genre } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        const result = await anilistService.getByGenre(genre, parseInt(limit), parseInt(offset));
        res.status(200).json(successResponse(`Anime dengan genre "${genre}" dari AniList`, result));
    } catch (error) {
        next(error);
    }
};

// === V2: GET SUGGESTIONS ===
const getSuggestions = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const result = await anilistService.getSuggestions(parseInt(limit));
        res.status(200).json(successResponse('Anime suggestions from AniList', result));
    } catch (error) {
        next(error);
    }
};

// === V2: GET FROM DB WITH SYNC ===
const getAnimeFromDBSync = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await anilistService.syncAnimeToDatabase(id, true);
        if (!result) {
            return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
        }
        res.status(200).json(successResponse('Anime from database (with sync)', result));
    } catch (error) {
        next(error);
    }
};

// === V2: SYNC ANIME FULL ===
const syncAnimeFull = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { includeRelations = true } = req.query;
        const result = await anilistService.syncAnimeToDatabase(id, includeRelations === 'true');
        if (!result) {
            return res.status(404).json(errorResponse('Anime tidak ditemukan di AniList'));
        }
        res.status(200).json(successResponse('Anime synced with relations', result));
    } catch (error) {
        next(error);
    }
};

// === V2: BATCH SYNC ===
const syncAnimeBatch = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json(errorResponse('Parameter "ids" wajib diisi (array)'));
        }
        const results = await anilistService.syncMultiple(ids, true);
        res.status(200).json(successResponse('Batch sync completed', results));
    } catch (error) {
        next(error);
    }
};

const controller = new AnilistController();

// Attach V2 methods to controller
controller.advancedSearch = advancedSearch;
controller.getFullDetail = getFullDetail;
controller.getTrendingAdvanced = getTrendingAdvanced;
controller.getPopularAdvanced = getPopularAdvanced;
controller.getSeasonalAdvanced = getSeasonalAdvanced;
controller.advancedFilter = advancedFilter;
controller.getStudioFullDetail = getStudioFullDetail;
controller.getByGenreFromAnilist = getByGenreFromAnilist;
controller.getSuggestions = getSuggestions;
controller.getAnimeFromDBSync = getAnimeFromDBSync;
controller.syncAnimeFull = syncAnimeFull;
controller.syncAnimeBatch = syncAnimeBatch;

module.exports = controller;
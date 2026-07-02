// src/controllers/animeController.js
const animeService = require('../services/animeService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AnimeController {
    // === GET ALL ANIME ===
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 20, ...filters } = req.query;
            const result = await animeService.getAll(filters, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse('Data anime berhasil diambil', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET ANIME BY ID ===
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const anime = await animeService.getById(id);
            res.status(200).json(successResponse('Detail anime', anime));
        } catch (error) {
            next(error);
        }
    }

    // === SEARCH ANIME ===
    async search(req, res, next) {
        try {
            const { q, page = 1, limit = 20 } = req.query;
            if (!q) {
                return res.status(400).json(errorResponse('Parameter "q" wajib diisi'));
            }
            const result = await animeService.search(q, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse('Hasil pencarian', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET TRENDING ===
    async getTrending(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const result = await animeService.getTrending(parseInt(limit));
            res.status(200).json(successResponse('Trending anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET POPULAR ===
    async getPopular(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const result = await animeService.getPopular(parseInt(limit));
            res.status(200).json(successResponse('Popular anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET LATEST ===
    async getLatest(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const result = await animeService.getLatest(parseInt(limit));
            res.status(200).json(successResponse('Latest anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET BY GENRE ===
    async getByGenre(req, res, next) {
        try {
            const { genre } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const result = await animeService.getByGenre(genre, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse(`Anime dengan genre "${genre}"`, result));
        } catch (error) {
            next(error);
        }
    }

    // === GET BY STUDIO ===
    async getByStudio(req, res, next) {
        try {
            const { studio } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const result = await animeService.getByStudio(studio, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse(`Anime dari studio "${studio}"`, result));
        } catch (error) {
            next(error);
        }
    }

    // === GET BY SEASON ===
    async getBySeason(req, res, next) {
        try {
            const { season, year } = req.params;
            const { limit = 20 } = req.query;
            const result = await animeService.getBySeason(season, parseInt(year), parseInt(limit));
            res.status(200).json(successResponse(`Anime season ${season} ${year}`, result));
        } catch (error) {
            next(error);
        }
    }

    // === GET EPISODES ===
    async getEpisodes(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const result = await animeService.getEpisodes(id, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse('Episode anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET CHARACTERS ===
    async getCharacters(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getCharacters(id);
            res.status(200).json(successResponse('Characters anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET STAFF ===
    async getStaff(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getStaff(id);
            res.status(200).json(successResponse('Staff anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET RECOMMENDATIONS ===
    async getRecommendations(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getRecommendations(id);
            res.status(200).json(successResponse('Rekomendasi anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET GENRES ===
    async getGenres(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getGenres(id);
            res.status(200).json(successResponse('Genres anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET STUDIOS ===
    async getStudios(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getStudios(id);
            res.status(200).json(successResponse('Studios anime', result));
        } catch (error) {
            next(error);
        }
    }

    // === GET STATISTICS ===
    async getStatistics(req, res, next) {
        try {
            const result = await animeService.getStatistics();
            res.status(200).json(successResponse('Statistik anime', result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AnimeController();
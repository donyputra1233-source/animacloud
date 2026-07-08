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

    // === V2: GET WITH RELATIONS ===
    async getByIdWithRelations(req, res, next) {
        try {
            const { id } = req.params;
            const anime = await animeService.getById(id);
            const relations = {
                genres: await animeService.getGenres(id),
                studios: await animeService.getStudios(id),
                characters: await animeService.getCharacters(id),
                staff: await animeService.getStaff(id),
                recommendations: await animeService.getRecommendations(id)
            };
            res.status(200).json(successResponse('Detail anime with relations', {
                ...anime,
                relations
            }));
        } catch (error) {
            next(error);
        }
    }

    // === V2: ADVANCED SEARCH ===
    async advancedSearch(req, res, next) {
        try {
            const { q, page = 1, limit = 20, genre, studio, season, year, status, format } = req.query;
            if (!q) {
                return res.status(400).json(errorResponse('Parameter "q" wajib diisi'));
            }
            const filters = { search: q, genre, studio, season, seasonYear: year, status, format };
            const result = await animeService.getAll(filters, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse('Advanced search results', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET BY GENRE ADVANCED ===
    async getByGenreAdvanced(req, res, next) {
        try {
            const { genre } = req.params;
            const { page = 1, limit = 20, status, format, minScore } = req.query;
            const filters = { genre, status, format, minScore };
            const result = await animeService.getAll(filters, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse(`Anime dengan genre "${genre}" (advanced)`, result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET BY STUDIO ADVANCED ===
    async getByStudioAdvanced(req, res, next) {
        try {
            const { studio } = req.params;
            const { page = 1, limit = 20, status, format } = req.query;
            const filters = { studio, status, format };
            const result = await animeService.getAll(filters, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse(`Anime dari studio "${studio}" (advanced)`, result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET BY SEASON ADVANCED ===
    async getBySeasonAdvanced(req, res, next) {
        try {
            const { season, year } = req.params;
            const { limit = 20, status, format } = req.query;
            const filters = { season, seasonYear: parseInt(year), status, format };
            const result = await animeService.getAll(filters, 1, parseInt(limit));
            res.status(200).json(successResponse(`Anime season ${season} ${year} (advanced)`, result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET RELATIONS ===
    async getRelations(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getRelations(id);
            res.status(200).json(successResponse('Anime relations', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET EXTERNAL LINKS ===
    async getExternalLinks(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getExternalLinks(id);
            res.status(200).json(successResponse('External links', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GET STREAMING LINKS ===
    async getStreamingLinks(req, res, next) {
        try {
            const { id } = req.params;
            const result = await animeService.getStreamingLinks(id);
            res.status(200).json(successResponse('Streaming links', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: FULL STATISTICS ===
    async getFullStatistics(req, res, next) {
        try {
            const result = await animeService.getFullStatistics();
            res.status(200).json(successResponse('Full statistics', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: BULK OPERATION ===
    async bulkOperation(req, res, next) {
        try {
            const { action, data } = req.body;
            if (!action || !data) {
                return res.status(400).json(errorResponse('Parameter "action" dan "data" wajib diisi'));
            }
            const result = await animeService.bulkOperation(action, data);
            res.status(200).json(successResponse('Bulk operation completed', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: DASHBOARD STATS ===
    async getDashboardStats(req, res, next) {
        try {
            const stats = await animeService.getStatistics();
            const trending = await animeService.getTrending(5);
            const popular = await animeService.getPopular(5);
            const latest = await animeService.getLatest(5);
            res.status(200).json(successResponse('Dashboard statistics', {
                stats,
                trending,
                popular,
                latest
            }));
        } catch (error) {
            next(error);
        }
    }

    // === V2: ANIME STATS ===
    async getAnimeStats(req, res, next) {
        try {
            const result = await animeService.getStatistics();
            res.status(200).json(successResponse('Anime statistics', result));
        } catch (error) {
            next(error);
        }
    }

    // === V2: GENRE STATS ===
    // Saat ini service belum menyediakan breakdown per-genre,
    // jadi pakai metrik ringkas yang ada.
    async getGenreStats(req, res, next) {
        try {
            const result = await animeService.getStatistics();
            res.status(200).json(successResponse('Genre statistics', {
                totalGenres: result.totalGenres
            }));
        } catch (error) {
            next(error);
        }
    }
}

const controller = new AnimeController();
// Bind untuk menghindari kasus method tidak terbaca sebagai fungsi saat dipakai di router
controller.getGenreStats = controller.getGenreStats.bind(controller);
controller.getDashboardStats = controller.getDashboardStats.bind(controller);
controller.getAnimeStats = controller.getAnimeStats.bind(controller);
module.exports = controller;




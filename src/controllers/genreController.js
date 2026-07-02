// src/controllers/genreController.js
const { Genre } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class GenreController {
    // === GET ALL GENRES ===
    async getAll(req, res, next) {
        try {
            const genres = await Genre.findAll();
            res.status(200).json(successResponse('Daftar genre', genres));
        } catch (error) {
            next(error);
        }
    }

    // === GET GENRE BY ID ===
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const genre = await Genre.findById(id);
            if (!genre) {
                return res.status(404).json(errorResponse('Genre tidak ditemukan'));
            }
            res.status(200).json(successResponse('Detail genre', genre));
        } catch (error) {
            next(error);
        }
    }

    // === GET ANIME BY GENRE ===
    async getAnimeByGenre(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const genre = await Genre.findById(id);
            if (!genre) {
                return res.status(404).json(errorResponse('Genre tidak ditemukan'));
            }
            const result = await Genre.getAnimeByGenre(id, parseInt(page), parseInt(limit));
            res.status(200).json(successResponse(`Anime dengan genre "${genre.name}"`, result));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GenreController();
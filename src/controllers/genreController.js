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
// src/controllers/genreController.js
// Tambahkan method V2 di akhir file, sebelum module.exports

// === V2: GET ALL WITH STATS ===
const getAllWithStats = async (req, res, next) => {
    try {
        const genres = await Genre.findAll();
        // Add stats to each genre
        const genresWithStats = await Promise.all(genres.map(async (genre) => {
            const animeCount = await Genre.getAnimeCount(genre.id);
            return {
                ...genre,
                animeCount
            };
        }));
        res.status(200).json(successResponse('Daftar genre dengan statistik', genresWithStats));
    } catch (error) {
        next(error);
    }
};

// === V2: GET BY ID WITH ANIME ===
const getByIdWithAnime = async (req, res, next) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findById(id);
        if (!genre) {
            return res.status(404).json(errorResponse('Genre tidak ditemukan'));
        }
        const anime = await Genre.getAnimeByGenre(id);
        res.status(200).json(successResponse('Detail genre dengan anime', {
            ...genre,
            anime
        }));
    } catch (error) {
        next(error);
    }
};

// === V2: GET ANIME BY GENRE ADVANCED ===
const getAnimeByGenreAdvanced = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, status, format, minScore } = req.query;
        const genre = await Genre.findById(id);
        if (!genre) {
            return res.status(404).json(errorResponse('Genre tidak ditemukan'));
        }
        const filters = { genre: genre.name, status, format, minScore };
        const result = await animeService.getAll(filters, parseInt(page), parseInt(limit));
        res.status(200).json(successResponse(`Anime dengan genre "${genre.name}" (advanced)`, result));
    } catch (error) {
        next(error);
    }
};

// === V2: POPULAR GENRES ===
const getPopularGenres = async (req, res, next) => {
    try {
        const genres = await Genre.findAll();
        const genresWithCount = await Promise.all(genres.map(async (genre) => {
            const count = await Genre.getAnimeCount(genre.id);
            return { ...genre, animeCount: count };
        }));
        const sorted = genresWithCount.sort((a, b) => b.animeCount - a.animeCount);
        res.status(200).json(successResponse('Popular genres', sorted.slice(0, 10)));
    } catch (error) {
        next(error);
    }
};

// === V2: SEARCH GENRES ===
const searchGenres = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json(errorResponse('Parameter "q" wajib diisi'));
        }
        const genres = await Genre.search(q);
        res.status(200).json(successResponse('Search genres results', genres));
    } catch (error) {
        next(error);
    }
};

const controller = new GenreController();

// Attach V2 methods to controller
controller.getAllWithStats = getAllWithStats;
controller.getByIdWithAnime = getByIdWithAnime;
controller.getAnimeByGenreAdvanced = getAnimeByGenreAdvanced;
controller.getPopularGenres = getPopularGenres;
controller.searchGenres = searchGenres;

module.exports = controller;
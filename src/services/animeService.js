// src/services/animeService.js
const { Anime, Genre, Studio, Character, Staff, Episode, Recommendation } = require('../models');
const db = require('../config/database');

class AnimeService {
    // === GET ALL ANIME (with filters & pagination) ===
    async getAll(filters = {}, page = 1, limit = 20) {
        const result = await Anime.findAll(filters, page, limit);
        return result;
    }

    // === GET ANIME BY ID ===
    async getById(id) {
        const anime = await Anime.findFullById(id);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return anime;
    }

    // === GET ANIME BY ANILIST ID ===
    async getByAnilistId(anilistId) {
        const anime = await Anime.findFullByAnilistId(anilistId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return anime;
    }

    // === SEARCH ANIME ===
    async search(query, page = 1, limit = 20) {
        if (!query) {
            throw new Error('Query pencarian wajib diisi');
        }
        return await Anime.findAll({ search: query }, page, limit);
    }

    // === GET TRENDING ANIME ===
    async getTrending(limit = 10) {
        return await Anime.getTrending(limit);
    }

    // === GET POPULAR ANIME ===
    async getPopular(limit = 10) {
        return await Anime.getPopular(limit);
    }

    // === GET LATEST ANIME ===
    async getLatest(limit = 10) {
        return await Anime.getLatest(limit);
    }

    // === GET ANIME BY GENRE ===
    async getByGenre(genre, page = 1, limit = 20) {
        const genreData = await Genre.findByName(genre);
        if (!genreData) {
            throw new Error(`Genre "${genre}" tidak ditemukan`);
        }
        return await Genre.getAnimeByGenre(genreData.id, page, limit);
    }

    // === GET ANIME BY STUDIO ===
    async getByStudio(studioName, page = 1, limit = 20) {
        const studio = await Studio.findByName(studioName);
        if (!studio) {
            throw new Error(`Studio "${studioName}" tidak ditemukan`);
        }
        return await Studio.getAnimeByStudio(studio.id, page, limit);
    }

    // === GET ANIME BY SEASON ===
    async getBySeason(season, year, limit = 20) {
        return await Anime.getBySeason(season, year, limit);
    }

    // === GET ANIME EPISODES ===
    async getEpisodes(animeId, page = 1, limit = 50) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getEpisodes(animeId, page, limit);
    }

    // === GET ANIME CHARACTERS ===
    async getCharacters(animeId) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getCharacters(animeId);
    }

    // === GET ANIME STAFF ===
    async getStaff(animeId) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getStaff(animeId);
    }

    // === GET ANIME RECOMMENDATIONS ===
    async getRecommendations(animeId) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getRecommendations(animeId);
    }

    // === GET ANIME GENRES ===
    async getGenres(animeId) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getGenres(animeId);
    }

    // === GET ANIME STUDIOS ===
    async getStudios(animeId) {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.getStudios(animeId);
    }

    // === CREATE ANIME ===
    async create(data) {
        // Check if anime already exists
        if (data.anilist_id) {
            const existing = await Anime.findByAnilistId(data.anilist_id);
            if (existing) {
                throw new Error(`Anime dengan AniList ID ${data.anilist_id} sudah ada`);
            }
        }
        return await Anime.create(data);
    }

    // === UPDATE ANIME ===
    async update(id, data) {
        const anime = await Anime.findById(id);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.update(id, data);
    }

    // === DELETE ANIME ===
    async delete(id) {
        const anime = await Anime.findById(id);
        if (!anime) {
            throw new Error('Anime tidak ditemukan');
        }
        return await Anime.delete(id);
    }

    // === GET ANIME STATISTICS ===
    async getStatistics() {
        const [totalAnime] = await db.query('SELECT COUNT(*) as count FROM anime');
        const [totalGenres] = await db.query('SELECT COUNT(*) as count FROM genres');
        const [totalStudios] = await db.query('SELECT COUNT(*) as count FROM studios');
        const [totalEpisodes] = await db.query('SELECT COUNT(*) as count FROM episodes');
        const [avgScore] = await db.query('SELECT AVG(average_score) as avg FROM anime WHERE average_score > 0');
        const [totalCharacters] = await db.query('SELECT COUNT(*) as count FROM characters');
        const [totalStaff] = await db.query('SELECT COUNT(*) as count FROM staff');

        return {
            totalAnime: totalAnime[0].count,
            totalGenres: totalGenres[0].count,
            totalStudios: totalStudios[0].count,
            totalEpisodes: totalEpisodes[0].count,
            totalCharacters: totalCharacters[0].count,
            totalStaff: totalStaff[0].count,
            averageScore: avgScore[0].avg ? Math.round(avgScore[0].avg) : 0
        };
    }
}

module.exports = new AnimeService();
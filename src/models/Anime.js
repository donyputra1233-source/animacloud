const db = require('../config/database');

class Anime {
    // === CREATE ===
    static async create(data) {
        const {
            anilist_id, title_romaji, title_english, title_native,
            synopsis, description, cover_image_large, cover_image_medium,
            cover_image_color, banner_image, format, status, episodes,
            duration, season, season_year, average_score, mean_score,
            popularity, favourites, trending, source, is_adult,
            site_url, trailer_id, trailer_site, next_airing_episode,
            next_airing_at, start_date, end_date
        } = data;

        const [result] = await db.query(
            `INSERT INTO anime (
                anilist_id, title_romaji, title_english, title_native,
                synopsis, description, cover_image_large, cover_image_medium,
                cover_image_color, banner_image, format, status, episodes,
                duration, season, season_year, average_score, mean_score,
                popularity, favourites, trending, source, is_adult,
                site_url, trailer_id, trailer_site, next_airing_episode,
                next_airing_at, start_date, end_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                anilist_id, title_romaji, title_english, title_native,
                synopsis, description, cover_image_large, cover_image_medium,
                cover_image_color, banner_image, format, status, episodes,
                duration, season, season_year, average_score, mean_score,
                popularity, favourites, trending, source, is_adult || false,
                site_url, trailer_id, trailer_site, next_airing_episode,
                next_airing_at, start_date, end_date
            ]
        );

        return result.insertId;
    }

    // === FIND BY ID ===
    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM anime WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    // === FIND BY ANILIST ID ===
    static async findByAnilistId(anilistId) {
        const [rows] = await db.query(
            `SELECT * FROM anime WHERE anilist_id = ?`,
            [anilistId]
        );
        return rows[0] || null;
    }

    // === FIND ALL (with pagination & filters) ===
    static async findAll(filters = {}, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        let whereClause = '1=1';
        const params = [];

        if (filters.status) {
            whereClause += ' AND status = ?';
            params.push(filters.status);
        }
        if (filters.format) {
            whereClause += ' AND format = ?';
            params.push(filters.format);
        }
        if (filters.season) {
            whereClause += ' AND season = ?';
            params.push(filters.season);
        }
        if (filters.seasonYear) {
            whereClause += ' AND season_year = ?';
            params.push(filters.seasonYear);
        }
        if (filters.genre) {
            whereClause += ` AND id IN (
                SELECT anime_id FROM anime_genres ag 
                JOIN genres g ON ag.genre_id = g.id 
                WHERE g.name = ?
            )`;
            params.push(filters.genre);
        }
        if (filters.search) {
            whereClause += ' AND (title_romaji LIKE ? OR title_english LIKE ? OR synopsis LIKE ?)';
            const search = `%${filters.search}%`;
            params.push(search, search, search);
        }
        if (filters.minScore) {
            whereClause += ' AND average_score >= ?';
            params.push(filters.minScore);
        }
        if (filters.maxScore) {
            whereClause += ' AND average_score <= ?';
            params.push(filters.maxScore);
        }

        // Count total
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM anime WHERE ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get data
        const sortField = filters.sortBy || 'popularity';
        const sortOrder = filters.sortOrder || 'DESC';
        
        const [rows] = await db.query(
            `SELECT * FROM anime 
             WHERE ${whereClause}
             ORDER BY ${sortField} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return {
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // === FIND FULL DETAIL (with relations) ===
    static async findFullById(id) {
        const [rows] = await db.query(
            `SELECT * FROM v_anime_full WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    // === FIND FULL BY ANILIST ID ===
    static async findFullByAnilistId(anilistId) {
        const [rows] = await db.query(
            `SELECT * FROM v_anime_full WHERE anilist_id = ?`,
            [anilistId]
        );
        return rows[0] || null;
    }

    // === UPDATE ===
    static async update(id, data) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'title_romaji', 'title_english', 'title_native',
            'synopsis', 'description', 'cover_image_large', 'cover_image_medium',
            'cover_image_color', 'banner_image', 'format', 'status', 'episodes',
            'duration', 'season', 'season_year', 'average_score', 'mean_score',
            'popularity', 'favourites', 'trending', 'source', 'is_adult',
            'site_url', 'trailer_id', 'trailer_site', 'next_airing_episode',
            'next_airing_at', 'start_date', 'end_date', 'last_synced_at'
        ];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await db.query(
            `UPDATE anime SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    // === UPSERT (Insert or Update) ===
    static async upsert(data) {
        const existing = await this.findByAnilistId(data.anilist_id);

        if (existing) {
            await this.update(existing.id, data);
            return existing.id;
        }

        // Kalau create() melempar error (mis. schema berbeda / kolom tidak sesuai),
        // lemparkan ulang agar pengujian/handler bisa melaporkan penyebab sesungguhnya.
        return await this.create(data);
    }

    // === DELETE ===
    static async delete(id) {
        const [result] = await db.query(
            `DELETE FROM anime WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    // === GET GENRES ===
    static async getGenres(animeId) {
        const [rows] = await db.query(
            `SELECT g.* FROM genres g
             JOIN anime_genres ag ON g.id = ag.genre_id
             WHERE ag.anime_id = ?`,
            [animeId]
        );
        return rows;
    }

    // === GET STUDIOS ===
    static async getStudios(animeId) {
        const [rows] = await db.query(
            `SELECT s.* FROM studios s
             JOIN anime_studios ast ON s.id = ast.studio_id
             WHERE ast.anime_id = ?`,
            [animeId]
        );
        return rows;
    }

    // === GET EPISODES ===
    static async getEpisodes(animeId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        
        const [rows] = await db.query(
            `SELECT * FROM episodes 
             WHERE anime_id = ? 
             ORDER BY episode_number ASC
             LIMIT ? OFFSET ?`,
            [animeId, limit, offset]
        );
        
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM episodes WHERE anime_id = ?`,
            [animeId]
        );
        
        return {
            data: rows,
            pagination: {
                page,
                limit,
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        };
    }

    // === GET CHARACTERS ===
    static async getCharacters(animeId) {
        const [rows] = await db.query(
            `SELECT c.*, ac.role, ac.voice_actor_name, ac.voice_actor_image
             FROM characters c
             JOIN anime_characters ac ON c.id = ac.character_id
             WHERE ac.anime_id = ?
             ORDER BY FIELD(ac.role, 'MAIN', 'SUPPORTING', 'BACKGROUND')`,
            [animeId]
        );
        return rows;
    }

    // === GET STAFF ===
    static async getStaff(animeId) {
        const [rows] = await db.query(
            `SELECT s.*, ast.role
             FROM staff s
             JOIN anime_staff ast ON s.id = ast.staff_id
             WHERE ast.anime_id = ?`,
            [animeId]
        );
        return rows;
    }

    // === GET RECOMMENDATIONS ===
    static async getRecommendations(animeId) {
        const [rows] = await db.query(
            `SELECT r.*, a.title_romaji, a.title_english, a.cover_image_large
             FROM recommendations r
             JOIN anime a ON r.recommended_anime_id = a.id
             WHERE r.anime_id = ?
             ORDER BY r.rating DESC`,
            [animeId]
        );
        return rows;
    }

    // === GET TRENDING ===
    static async getTrending(limit = 10) {
        const [rows] = await db.query(
            `SELECT * FROM v_anime_trending LIMIT ?`,
            [limit]
        );
        return rows;
    }

    // === GET POPULAR ===
    static async getPopular(limit = 10) {
        const [rows] = await db.query(
            `SELECT * FROM anime ORDER BY popularity DESC LIMIT ?`,
            [limit]
        );
        return rows;
    }

    // === GET LATEST ===
    static async getLatest(limit = 10) {
        const [rows] = await db.query(
            `SELECT * FROM anime ORDER BY created_at DESC LIMIT ?`,
            [limit]
        );
        return rows;
    }

    // === GET BY SEASON ===
    static async getBySeason(season, year, limit = 20) {
        const [rows] = await db.query(
            `SELECT * FROM anime 
             WHERE season = ? AND season_year = ?
             ORDER BY popularity DESC
             LIMIT ?`,
            [season, year, limit]
        );
        return rows;
    }
}

module.exports = Anime;
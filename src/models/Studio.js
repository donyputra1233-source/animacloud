const db = require('../config/database');

class Studio {
    static async create(data) {
        const { anilist_id, name, site_url, is_animation_studio } = data;
        const [result] = await db.query(
            `INSERT INTO studios (anilist_id, name, site_url, is_animation_studio) 
             VALUES (?, ?, ?, ?)`,
            [anilist_id, name, site_url, is_animation_studio !== false]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM studios WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByName(name) {
        const [rows] = await db.query(
            `SELECT * FROM studios WHERE name = ?`,
            [name]
        );
        return rows[0] || null;
    }

    static async findByAnilistId(anilistId) {
        const [rows] = await db.query(
            `SELECT * FROM studios WHERE anilist_id = ?`,
            [anilistId]
        );
        return rows[0] || null;
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT * FROM studios ORDER BY name`
        );
        return rows;
    }

    static async getAnimeByStudio(studioId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        
        const [rows] = await db.query(
            `SELECT a.* FROM anime a
             JOIN anime_studios ast ON a.id = ast.anime_id
             WHERE ast.studio_id = ?
             ORDER BY a.popularity DESC
             LIMIT ? OFFSET ?`,
            [studioId, limit, offset]
        );
        
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM anime_studios WHERE studio_id = ?`,
            [studioId]
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

    static async upsert(data) {
        const existing = await this.findByAnilistId(data.anilist_id);
        if (existing) {
            // Update if needed
            return existing.id;
        }
        return await this.create(data);
    }
}

module.exports = Studio;
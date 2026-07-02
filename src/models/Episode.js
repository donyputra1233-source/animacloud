const db = require('../config/database');

class Episode {
    static async create(data) {
        const { anime_id, episode_number, title, title_romaji, thumbnail, site_url, duration, airing_at } = data;
        const [result] = await db.query(
            `INSERT INTO episodes 
             (anime_id, episode_number, title, title_romaji, thumbnail, site_url, duration, airing_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [anime_id, episode_number, title, title_romaji, thumbnail, site_url, duration, airing_at]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM episodes WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByAnime(animeId, limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT * FROM episodes 
             WHERE anime_id = ? 
             ORDER BY episode_number ASC
             LIMIT ? OFFSET ?`,
            [animeId, limit, offset]
        );
        return rows;
    }

    static async findByAnimeAndNumber(animeId, episodeNumber) {
        const [rows] = await db.query(
            `SELECT * FROM episodes 
             WHERE anime_id = ? AND episode_number = ?`,
            [animeId, episodeNumber]
        );
        return rows[0] || null;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        const allowedFields = ['title', 'title_romaji', 'thumbnail', 'site_url', 'duration', 'airing_at'];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await db.query(
            `UPDATE episodes SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async upsert(data) {
        const existing = await this.findByAnimeAndNumber(data.anime_id, data.episode_number);
        if (existing) {
            await this.update(existing.id, data);
            return existing.id;
        }
        return await this.create(data);
    }
}

module.exports = Episode;
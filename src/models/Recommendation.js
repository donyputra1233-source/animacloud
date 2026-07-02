const db = require('../config/database');

class Recommendation {
    static async create(data) {
        const { anime_id, recommended_anime_id, rating } = data;
        const [result] = await db.query(
            `INSERT INTO recommendations (anime_id, recommended_anime_id, rating)
             VALUES (?, ?, ?)`,
            [anime_id, recommended_anime_id, rating || 0]
        );
        return result.insertId;
    }

    static async findByAnime(animeId) {
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

    static async deleteByAnime(animeId) {
        const [result] = await db.query(
            `DELETE FROM recommendations WHERE anime_id = ?`,
            [animeId]
        );
        return result.affectedRows;
    }

    static async upsert(data) {
        // Check if exists
        const [existing] = await db.query(
            `SELECT id FROM recommendations 
             WHERE anime_id = ? AND recommended_anime_id = ?`,
            [data.anime_id, data.recommended_anime_id]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE recommendations SET rating = ? WHERE id = ?`,
                [data.rating || 0, existing[0].id]
            );
            return existing[0].id;
        }

        return await this.create(data);
    }
}

module.exports = Recommendation;
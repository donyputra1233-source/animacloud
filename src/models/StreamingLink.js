const db = require('../config/database');

class StreamingLink {
    static async create(data) {
        const { anime_id, site, url, type, language, is_official } = data;
        const [result] = await db.query(
            `INSERT INTO streaming_links (anime_id, site, url, type, language, is_official)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [anime_id, site, url, type || 'STREAMING', language || 'en', is_official !== false]
        );
        return result.insertId;
    }

    static async findByAnime(animeId) {
        const [rows] = await db.query(
            `SELECT * FROM streaming_links WHERE anime_id = ?`,
            [animeId]
        );
        return rows;
    }

    static async deleteByAnime(animeId) {
        const [result] = await db.query(
            `DELETE FROM streaming_links WHERE anime_id = ?`,
            [animeId]
        );
        return result.affectedRows;
    }
}

module.exports = StreamingLink;
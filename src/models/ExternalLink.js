const db = require('../config/database');

class ExternalLink {
    static async create(data) {
        const { anime_id, site, url, type, language } = data;
        const [result] = await db.query(
            `INSERT INTO external_links (anime_id, site, url, type, language)
             VALUES (?, ?, ?, ?, ?)`,
            [anime_id, site, url, type || null, language || 'en']
        );
        return result.insertId;
    }

    static async findByAnime(animeId) {
        const [rows] = await db.query(
            `SELECT * FROM external_links WHERE anime_id = ?`,
            [animeId]
        );
        return rows;
    }

    static async deleteByAnime(animeId) {
        const [result] = await db.query(
            `DELETE FROM external_links WHERE anime_id = ?`,
            [animeId]
        );
        return result.affectedRows;
    }
}

module.exports = ExternalLink;
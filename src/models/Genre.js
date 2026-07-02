const db = require('../config/database');

class Genre {
    static async create(data) {
        const { name, slug } = data;
        const [result] = await db.query(
            `INSERT INTO genres (name, slug) VALUES (?, ?)`,
            [name, slug || name.toLowerCase().replace(/ /g, '-')]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM genres WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByName(name) {
        const [rows] = await db.query(
            `SELECT * FROM genres WHERE name = ?`,
            [name]
        );
        return rows[0] || null;
    }

    static async findAll() {
        const [rows] = await db.query(
            `SELECT * FROM genres ORDER BY name`
        );
        return rows;
    }

    static async getAnimeByGenre(genreId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        
        const [rows] = await db.query(
            `SELECT a.* FROM anime a
             JOIN anime_genres ag ON a.id = ag.anime_id
             WHERE ag.genre_id = ?
             ORDER BY a.popularity DESC
             LIMIT ? OFFSET ?`,
            [genreId, limit, offset]
        );
        
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM anime_genres WHERE genre_id = ?`,
            [genreId]
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

    static async upsert(name) {
        let genre = await this.findByName(name);
        if (!genre) {
            const id = await this.create({ name });
            genre = await this.findById(id);
        }
        return genre;
    }

    static async updateAnimeCount(genreId) {
        const [result] = await db.query(
            `UPDATE genres SET anime_count = (
                SELECT COUNT(*) FROM anime_genres WHERE genre_id = ?
            ) WHERE id = ?`,
            [genreId, genreId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Genre;
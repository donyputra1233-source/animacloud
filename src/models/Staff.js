const db = require('../config/database');

class Staff {
    static async create(data) {
        const { anilist_id, name_full, name_native, image_large, image_medium, description } = data;
        const [result] = await db.query(
            `INSERT INTO staff (anilist_id, name_full, name_native, image_large, image_medium, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [anilist_id, name_full, name_native, image_large, image_medium, description]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM staff WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByAnilistId(anilistId) {
        const [rows] = await db.query(
            `SELECT * FROM staff WHERE anilist_id = ?`,
            [anilistId]
        );
        return rows[0] || null;
    }

    static async addToAnime(animeId, staffId, role) {
        const [result] = await db.query(
            `INSERT INTO anime_staff (anime_id, staff_id, role)
             VALUES (?, ?, ?)`,
            [animeId, staffId, role || 'Staff']
        );
        return result.insertId;
    }

    static async upsert(data) {
        const existing = await this.findByAnilistId(data.anilist_id);
        if (existing) {
            return existing.id;
        }
        return await this.create(data);
    }
}

module.exports = Staff;
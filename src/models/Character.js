const db = require('../config/database');

class Character {
    static async create(data) {
        const { anilist_id, name_full, name_native, name_alternative, image_large, image_medium, description } = data;
        const [result] = await db.query(
            `INSERT INTO characters (anilist_id, name_full, name_native, name_alternative, image_large, image_medium, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [anilist_id, name_full, name_native, name_alternative, image_large, image_medium, description]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM characters WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByAnilistId(anilistId) {
        const [rows] = await db.query(
            `SELECT * FROM characters WHERE anilist_id = ?`,
            [anilistId]
        );
        return rows[0] || null;
    }

    static async addToAnime(animeId, characterId, role, voiceActorData = null) {
        const [result] = await db.query(
            `INSERT INTO anime_characters 
             (anime_id, character_id, role, voice_actor_name, voice_actor_image)
             VALUES (?, ?, ?, ?, ?)`,
            [
                animeId,
                characterId,
                role || 'SUPPORTING',
                voiceActorData?.name || null,
                voiceActorData?.image || null
            ]
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

module.exports = Character;
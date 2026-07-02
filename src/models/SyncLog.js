const db = require('../config/database');

class SyncLog {
    static async create(data) {
        const { sync_type, source, status, total_items, synced_items, failed_items, error_message } = data;
        const [result] = await db.query(
            `INSERT INTO sync_logs 
             (sync_type, source, status, total_items, synced_items, failed_items, error_message, started_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [sync_type || 'FULL', source || 'anilist', status || 'RUNNING', 
             total_items || 0, synced_items || 0, failed_items || 0, error_message || null]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        const allowedFields = ['status', 'total_items', 'synced_items', 'failed_items', 'error_message', 'completed_at'];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) return false;

        if (data.status === 'SUCCESS' || data.status === 'FAILED') {
            fields.push('completed_at = NOW()');
        }

        values.push(id);
        const [result] = await db.query(
            `UPDATE sync_logs SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async findAll(limit = 10) {
        const [rows] = await db.query(
            `SELECT * FROM sync_logs ORDER BY started_at DESC LIMIT ?`,
            [limit]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM sync_logs WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }
}

module.exports = SyncLog;
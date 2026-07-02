// scripts/migrate.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
    console.log('========================================');
    console.log('🔄 Database Migration');
    console.log('========================================\n');

    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('❌ Koneksi gagal:', err.message);
                reject(err);
                return;
            }

            console.log('✅ Terkoneksi ke MySQL');

            // Create database if not exists
            const dbName = process.env.DB_NAME || 'animacloud_db';
            connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
                if (err) {
                    console.error('❌ Gagal membuat database:', err.message);
                    connection.end();
                    reject(err);
                    return;
                }
                console.log(`✅ Database ${dbName} siap`);

                connection.changeUser({ database: dbName }, (err) => {
                    if (err) {
                        console.error('❌ Gagal switch database:', err.message);
                        connection.end();
                        reject(err);
                        return;
                    }

                    const sqlFile = path.join(__dirname, '../database/migration.sql');
                    const sql = fs.readFileSync(sqlFile, 'utf8');

                    console.log('🔄 Menjalankan migration...');
                    connection.query(sql, (err) => {
                        if (err) {
                            console.error('❌ Migration gagal:', err.message);
                            connection.end();
                            reject(err);
                            return;
                        }

                        console.log('✅ Migration berhasil!');
                        connection.end();
                        resolve();
                    });
                });
            });
        });
    });
}

migrate().catch(() => process.exit(1));
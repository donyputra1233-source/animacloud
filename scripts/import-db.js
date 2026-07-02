// scripts/import-db.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importDatabase() {
    console.log('========================================');
    console.log('📦 Import Database Animacloud-API');
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
                console.error('   Pastikan XAMPP MySQL sedang berjalan');
                reject(err);
                return;
            }

            console.log('✅ Terkoneksi ke MySQL');

            const sqlFile = path.join(__dirname, '../database/migration.sql');
            
            if (!fs.existsSync(sqlFile)) {
                console.error(`❌ File tidak ditemukan: ${sqlFile}`);
                connection.end();
                reject(new Error('File migration.sql tidak ditemukan'));
                return;
            }

            console.log(`📄 Membaca file: ${sqlFile}`);
            const sql = fs.readFileSync(sqlFile, 'utf8');

            console.log('🔄 Mengimport database...');

            connection.query(sql, (err, results) => {
                if (err) {
                    console.error('❌ Import gagal:', err.message);
                    if (err.sql) {
                        console.error('   SQL Error:', err.sql.substring(0, 200) + '...');
                    }
                    connection.end();
                    reject(err);
                    return;
                }

                console.log('✅ Database berhasil diimport!');
                console.log('\n📊 Tabel yang dibuat:');
                connection.query('SHOW TABLES FROM animacloud_db', (err, tables) => {
                    if (!err && tables) {
                        tables.forEach(row => {
                            const tableName = Object.values(row)[0];
                            console.log(`   - ${tableName}`);
                        });
                    }
                    connection.end();
                    resolve();
                });
            });
        });
    });
}

// Jalankan
importDatabase().catch(() => process.exit(1));
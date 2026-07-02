// scripts/seed.js
require('dotenv').config();

const db = require('../src/config/database');
const { Genre } = require('../src/models');

const defaultGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
    'Sports', 'Supernatural', 'Thriller', 'Martial Arts',
    'Shounen', 'Seinen', 'Shojo', 'Josei', 'Mecha', 'Music',
    'Parody', 'Samurai', 'School', 'Ecchi', 'Harem',
    'Demons', 'Game', 'Historical', 'Magic', 'Military',
    'Psychological', 'Isekai', 'Reincarnation', 'Vampire',
    'Zombie', 'Cyberpunk', 'Steampunk', 'Detective', 'Gore',
    'Medical', 'Space', 'Super Power', 'Adventure'
];

async function seed() {
    console.log('========================================');
    console.log('🌱 Seeding Database');
    console.log('========================================\n');

    try {
        console.log('📌 Seeding genres...');
        let count = 0;

        for (const name of defaultGenres) {
            const existing = await Genre.findByName(name);
            if (!existing) {
                await Genre.create({ name });
                count++;
                console.log(`   ✅ Added: ${name}`);
            } else {
                console.log(`   ⏭️  Already exists: ${name}`);
            }
        }

        console.log(`\n✅ Seeded ${count} new genres`);
        console.log(`📊 Total genres: ${defaultGenres.length}`);

        // Update genre counts
        console.log('\n📌 Updating genre counts...');
        await db.query(`
            UPDATE genres g 
            SET anime_count = (
                SELECT COUNT(*) FROM anime_genres ag WHERE ag.genre_id = g.id
            )
        `);
        console.log('✅ Genre counts updated');

        console.log('\n========================================');
        console.log('✅ Seeding completed!');
        console.log('========================================');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await db.end();
    }
}

seed();
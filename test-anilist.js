// test-anilist.js
require('dotenv').config();

const anilistApi = require('./src/config/anilistApi');
const { Anime, Genre, Studio } = require('./src/models');
const db = require('./src/config/database');

async function testAnilistAPI() {
    console.log('========================================');
    console.log('🚀 Testing AniList API Integration');
    console.log('========================================\n');

    try {
        // ============================================
        // TEST 1: Search Anime
        // ============================================
        console.log('📌 TEST 1: Search Anime');
        console.log('🔍 Mencari: "naruto"\n');
        
        const searchResults = await anilistApi.searchAnime('naruto', 1, 5);
        console.log(`✅ Ditemukan ${searchResults.media?.length || 0} anime:`);
        
        if (searchResults.media && searchResults.media.length > 0) {
            searchResults.media.slice(0, 5).forEach((item, i) => {
                console.log(`   ${i+1}. ${item.title?.romaji || 'Unknown'}`);
                console.log(`      English: ${item.title?.english || 'N/A'}`);
                console.log(`      Score: ${item.averageScore || 'N/A'}`);
                console.log(`      Episodes: ${item.episodes || 'N/A'}`);
                console.log(`      Status: ${item.status || 'N/A'}`);
                console.log(`      Genres: ${item.genres?.join(', ') || 'N/A'}`);
                console.log(`      Studios: ${item.studios?.nodes?.map(s => s.name).join(', ') || 'N/A'}`);
                console.log('');
            });
        }
        console.log('='.repeat(50) + '\n');

        // ============================================
        // TEST 2: Get Anime Detail by ID
        // ============================================
        console.log('📌 TEST 2: Get Anime Detail by ID');
        const testId = 20; // Naruto
        console.log(`🔍 Mengambil detail anime ID: ${testId}\n`);
        
        const detail = await anilistApi.getAnime(testId);
        if (detail) {
            console.log(`✅ Judul: ${detail.title?.romaji || 'Unknown'}`);
            console.log(`   English: ${detail.title?.english || 'N/A'}`);
            console.log(`   Native: ${detail.title?.native || 'N/A'}`);
            console.log(`   Score: ${detail.averageScore || 'N/A'}`);
            console.log(`   Popularity: ${detail.popularity || 'N/A'}`);
            console.log(`   Favourites: ${detail.favourites || 'N/A'}`);
            console.log(`   Episodes: ${detail.episodes || 'N/A'}`);
            console.log(`   Status: ${detail.status || 'N/A'}`);
            console.log(`   Format: ${detail.format || 'N/A'}`);
            console.log(`   Season: ${detail.season || 'N/A'} ${detail.seasonYear || ''}`);
            console.log(`   Genres: ${detail.genres?.join(', ') || 'N/A'}`);
            console.log(`   Studios: ${detail.studios?.nodes?.map(s => s.name).join(', ') || 'N/A'}`);
            console.log(`   Characters: ${detail.characters?.edges?.length || 0}`);
            console.log(`   Staff: ${detail.staff?.edges?.length || 0}`);
            console.log(`   Recommendations: ${detail.recommendations?.nodes?.length || 0}`);
            console.log(`   Relations: ${detail.relations?.edges?.length || 0}`);
            
            // Trailer
            if (detail.trailer) {
                console.log(`   Trailer: ${detail.trailer.site} - ${detail.trailer.id}`);
            }
            
            // Synopsis (potong jika panjang)
            if (detail.description) {
                const synopsis = detail.description.length > 200 
                    ? detail.description.substring(0, 200) + '...' 
                    : detail.description;
                console.log(`   Synopsis: ${synopsis}`);
            }
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // ============================================
        // TEST 3: Trending Anime
        // ============================================
        console.log('📌 TEST 3: Trending Anime');
        console.log('🔥 Top 5 Trending\n');
        
        const trending = await anilistApi.getTrending(1, 5);
        if (trending.media) {
            trending.media.forEach((item, i) => {
                console.log(`   ${i+1}. ${item.title?.romaji || 'Unknown'}`);
                console.log(`      Score: ${item.averageScore || 'N/A'}`);
                console.log(`      Trending: ${item.trending || 'N/A'}`);
                console.log(`      Episodes: ${item.episodes || 'N/A'}`);
                console.log(`      Status: ${item.status || 'N/A'}`);
                console.log('');
            });
        }
        console.log('='.repeat(50) + '\n');

        // ============================================
        // TEST 4: Popular Anime
        // ============================================
        console.log('📌 TEST 4: Popular Anime');
        console.log('⭐ Top 5 Popular\n');
        
        const popular = await anilistApi.getPopular(1, 5);
        if (popular.media) {
            popular.media.forEach((item, i) => {
                console.log(`   ${i+1}. ${item.title?.romaji || 'Unknown'}`);
                console.log(`      Score: ${item.averageScore || 'N/A'}`);
                console.log(`      Popularity: ${item.popularity || 'N/A'}`);
                console.log(`      Format: ${item.format || 'N/A'}`);
                console.log('');
            });
        }
        console.log('='.repeat(50) + '\n');

        // ============================================
        // TEST 5: Seasonal Anime
        // ============================================
        console.log('📌 TEST 5: Seasonal Anime');
        const currentYear = new Date().getFullYear();
        console.log(`🍂 Seasonal: SUMMER ${currentYear}\n`);
        
        const seasonal = await anilistApi.getSeasonal('SUMMER', currentYear, 1, 5);
        if (seasonal.media) {
            seasonal.media.forEach((item, i) => {
                console.log(`   ${i+1}. ${item.title?.romaji || 'Unknown'}`);
                console.log(`      Score: ${item.averageScore || 'N/A'}`);
                console.log(`      Format: ${item.format || 'N/A'}`);
                console.log(`      Genres: ${item.genres?.join(', ') || 'N/A'}`);
                console.log('');
            });
        }
        console.log('='.repeat(50) + '\n');

        // ============================================
        // TEST 6: Get Anime by Genre
        // ============================================
        console.log('📌 TEST 6: Get Anime by Genre');
        console.log('🎭 Genre: Action\n');
        
        const genreAnime = await anilistApi.getByGenre('Action', 1, 5);
        if (genreAnime.media) {
            genreAnime.media.forEach((item, i) => {
                console.log(`   ${i+1}. ${item.title?.romaji || 'Unknown'}`);
                console.log(`      Score: ${item.averageScore || 'N/A'}`);
                console.log(`      Genres: ${item.genres?.join(', ') || 'N/A'}`);
                console.log('');
            });
        }
        console.log('='.repeat(50) + '\n');

        // ============================================
        // TEST 7: Database Connection
        // ============================================
        console.log('📌 TEST 7: Database Connection');
        
        try {
            const [rows] = await db.query('SELECT 1 as connected');
        console.log(`✅ Database connected: ${rows[0]?.connected === 1 ? 'Yes' : 'No'}`);
        } catch (error) {
            console.log(`❌ Database error: ${error.message}`);
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // ============================================
        // TEST 8: Sync Anime to Database
        // ============================================
        console.log('📌 TEST 8: Sync Anime to Database');
        console.log(`💾 Syncing anime ID: ${testId}\n`);
        
        // Check if anime exists in database
        const existing = await Anime.findByAnilistId(testId);
        if (existing) {
            console.log(`✅ Anime already exists in database (ID: ${existing.id})`);
        } else {
            // Sync from AniList
            const detail = await anilistApi.getAnime(testId);
            if (detail) {
                const animeData = {
                    anilist_id: detail.id,
                    title_romaji: detail.title?.romaji,
                    title_english: detail.title?.english,
                    title_native: detail.title?.native,
                    synopsis: detail.description ? detail.description.substring(0, 5000) : null,
                    description: detail.description,
                    cover_image_large: detail.coverImage?.large,
                    cover_image_medium: detail.coverImage?.medium,
                    cover_image_color: detail.coverImage?.color,
                    banner_image: detail.bannerImage,
                    format: detail.format,
                    status: detail.status,
                    episodes: detail.episodes,
                    duration: detail.duration,
                    season: detail.season,
                    season_year: detail.seasonYear,
                    average_score: detail.averageScore,
                    mean_score: detail.meanScore,
                    popularity: detail.popularity,
                    favourites: detail.favourites,
                    trending: detail.trending,
                    site_url: detail.siteUrl,
                    trailer_id: detail.trailer?.id,
                    trailer_site: detail.trailer?.site,
                    start_date: detail.startDate ? `${detail.startDate.year}-${String(detail.startDate.month).padStart(2, '0')}-${String(detail.startDate.day).padStart(2, '0')}` : null,
                    end_date: detail.endDate ? `${detail.endDate.year}-${String(detail.endDate.month).padStart(2, '0')}-${String(detail.endDate.day).padStart(2, '0')}` : null
                };
                
                const animeId = await Anime.create(animeData);
                console.log(`✅ Anime synced to database (ID: ${animeId})`);
                
                // Sync genres
                if (detail.genres) {
                    for (const genreName of detail.genres) {
                        const genre = await Genre.upsert(genreName);
                        await db.query(
                            'INSERT IGNORE INTO anime_genres (anime_id, genre_id) VALUES (?, ?)',
                            [animeId, genre.id]
                        );
                    }
                    console.log(`   ✅ Synced ${detail.genres.length} genres`);
                }
                
                // Sync studios
                if (detail.studios?.nodes) {
                    for (const studioData of detail.studios.nodes) {
                        const studio = await Studio.upsert({
                            name: studioData.name,
                            site_url: studioData.siteUrl,
                            is_animation_studio: true
                        });
                        await db.query(
                            'INSERT IGNORE INTO anime_studios (anime_id, studio_id) VALUES (?, ?)',
                            [animeId, studio.id]
                        );
                    }
                    console.log(`   ✅ Synced ${detail.studios.nodes.length} studios`);
                }
            }
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // ============================================
        // TEST 9: Get Anime from Database
        // ============================================
        console.log('📌 TEST 9: Get Anime from Database');
        
        const dbAnime = await Anime.findFullByAnilistId(testId);
        if (dbAnime) {
            console.log(`✅ Found in database:`);
            console.log(`   ID: ${dbAnime.id}`);
            console.log(`   Title: ${dbAnime.title_romaji || 'N/A'}`);
            console.log(`   Score: ${dbAnime.average_score || 'N/A'}`);
            console.log(`   Status: ${dbAnime.status || 'N/A'}`);
            console.log(`   Genres: ${dbAnime.genre_names || 'N/A'}`);
            console.log(`   Studios: ${dbAnime.studio_names || 'N/A'}`);
            console.log(`   Episodes: ${dbAnime.episodes || 'N/A'}`);
            console.log(`   Last Synced: ${dbAnime.last_synced_at || 'N/A'}`);
        } else {
            console.log(`❌ Anime not found in database`);
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // ============================================
        // TEST 10: List All Genres
        // ============================================
        console.log('📌 TEST 10: List All Genres');
        
        const genres = await Genre.findAll();
        console.log(`✅ ${genres.length} genres in database:`);
        genres.slice(0, 10).forEach((genre) => {
            console.log(`   - ${genre.name} (${genre.anime_count || 0} anime)`);
        });
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('✨ All tests completed successfully!');
        console.log(`📊 Source: AniList API (GraphQL)`);
        console.log(`💾 Database: ${process.env.DB_NAME || 'animacloud_db'}`);

    } catch (error) {
        console.error('❌ Error during test:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        console.error(error.stack);
    } finally {
        // Close database connection
        await db.end();
    }
}

// Run the test
testAnilistAPI();
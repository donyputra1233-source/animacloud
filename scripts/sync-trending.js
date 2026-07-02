// scripts/sync-trending.js
require('dotenv').config();

const anilistApi = require('../src/config/anilistApi');
const { Anime, Genre, Studio, SyncLog } = require('../src/models');
const db = require('../src/config/database');

async function syncTrending(limit = 20) {
    console.log('========================================');
    console.log('🔥 Sync Trending Anime from AniList');
    console.log('========================================\n');

    let syncLogId = null;

    try {
        // Create sync log
        syncLogId = await SyncLog.create({
            sync_type: 'TRENDING',
            source: 'anilist',
            status: 'RUNNING',
            total_items: limit
        });

        console.log(`📊 Fetching top ${limit} trending anime...`);
        const data = await anilistApi.getTrending(1, limit);
        
        if (!data.media || data.media.length === 0) {
            console.log('❌ No trending anime found');
            await SyncLog.update(syncLogId, {
                status: 'FAILED',
                error_message: 'No trending anime found'
            });
            return;
        }

        console.log(`✅ Found ${data.media.length} trending anime\n`);
        console.log('💾 Syncing to database...\n');

        let synced = 0;
        let failed = 0;

        for (const item of data.media) {
            try {
                console.log(`   🔄 Syncing: ${item.title?.romaji || 'Unknown'}`);
                
                // Get full detail
                const detail = await anilistApi.getAnime(item.id);
                if (!detail) {
                    console.log(`   ❌ Failed to get detail for ${item.id}`);
                    failed++;
                    continue;
                }

                // Prepare data
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
                    start_date: detail.startDate ? 
                        `${detail.startDate.year}-${String(detail.startDate.month).padStart(2, '0')}-${String(detail.startDate.day).padStart(2, '0')}` : 
                        null,
                    end_date: detail.endDate ? 
                        `${detail.endDate.year}-${String(detail.endDate.month).padStart(2, '0')}-${String(detail.endDate.day).padStart(2, '0')}` : 
                        null
                };

                // Upsert anime
                const existing = await Anime.findByAnilistId(detail.id);
                let animeId;

                if (existing) {
                    await Anime.update(existing.id, animeData);
                    animeId = existing.id;
                    console.log(`   ✅ Updated: ${detail.title?.romaji} (ID: ${animeId})`);
                } else {
                    animeId = await Anime.create(animeData);
                    console.log(`   ✅ Inserted: ${detail.title?.romaji} (ID: ${animeId})`);
                }

                // Sync genres
                if (detail.genres && detail.genres.length > 0) {
                    await db.query('DELETE FROM anime_genres WHERE anime_id = ?', [animeId]);
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
                if (detail.studios?.nodes && detail.studios.nodes.length > 0) {
                    await db.query('DELETE FROM anime_studios WHERE anime_id = ?', [animeId]);
                    for (const studioData of detail.studios.nodes) {
                        const studio = await Studio.upsert({
                            name: studioData.name,
                            site_url: studioData.siteUrl,
                            is_animation_studio: studioData.isAnimationStudio !== false
                        });
                        await db.query(
                            'INSERT IGNORE INTO anime_studios (anime_id, studio_id) VALUES (?, ?)',
                            [animeId, studio.id]
                        );
                    }
                    console.log(`   ✅ Synced ${detail.studios.nodes.length} studios`);
                }

                synced++;
                console.log(`   ✅ Done: ${detail.title?.romaji}\n`);

                // Delay to avoid rate limit
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                failed++;
            }
        }

        // Update sync log
        await SyncLog.update(syncLogId, {
            status: 'SUCCESS',
            synced_items: synced,
            failed_items: failed,
            completed_at: new Date().toISOString()
        });

        console.log('========================================');
        console.log(`✅ Sync completed!`);
        console.log(`   ✅ Synced: ${synced}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log('========================================');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        if (syncLogId) {
            await SyncLog.update(syncLogId, {
                status: 'FAILED',
                error_message: error.message
            });
        }
        process.exit(1);
    } finally {
        await db.end();
    }
}

// Get limit from command line
const limit = parseInt(process.argv[2]) || 20;
syncTrending(limit);
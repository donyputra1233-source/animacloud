// tests/integration/anilist.test.js
const anilistApi = require('../../src/config/anilistApi');
const { Anime, Genre, Studio } = require('../../src/models');
const db = require('../../src/config/database');

describe('AniList Integration Tests', () => {
    let testAnimeId = 20; // Naruto
    
    beforeAll(async () => {
        // Ensure clean state
        await db.query('DELETE FROM sync_logs WHERE source = "anilist"');
    });

    afterAll(async () => {
        await db.end();
    });

    test('should fetch anime from AniList API', async () => {
        const result = await anilistApi.getAnime(testAnimeId);
        expect(result).toBeDefined();
        expect(result.id).toBe(testAnimeId);
        expect(result.title).toBeDefined();
        expect(result.title.romaji).toBeDefined();
    });

    test('should search anime from AniList API', async () => {
        const result = await anilistApi.searchAnime('naruto', 1, 5);
        expect(result).toBeDefined();
        expect(result.media).toBeDefined();
        expect(result.media.length).toBeGreaterThan(0);
    });

    test('should get trending anime from AniList API', async () => {
        const result = await anilistApi.getTrending(1, 5);
        expect(result).toBeDefined();
        expect(result.media).toBeDefined();
        expect(result.media.length).toBeGreaterThan(0);
    });

    test('should sync anime to database', async () => {
        const detail = await anilistApi.getAnime(testAnimeId);
        expect(detail).toBeDefined();

        // Check if exists
        let existing = await Anime.findByAnilistId(testAnimeId);
        if (existing) {
            await Anime.delete(existing.id);
        }

        // Create
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
        expect(animeId).toBeGreaterThan(0);

        // Verify
        const saved = await Anime.findById(animeId);
        expect(saved).toBeDefined();
        expect(saved.anilist_id).toBe(testAnimeId);
        expect(saved.title_romaji).toBe(detail.title?.romaji);
    });

    test('should sync genres to database', async () => {
        const detail = await anilistApi.getAnime(testAnimeId);
        const anime = await Anime.findByAnilistId(testAnimeId);
        expect(anime).toBeDefined();

        if (detail.genres) {
            for (const genreName of detail.genres) {
                const genre = await Genre.upsert(genreName);
                expect(genre).toBeDefined();
                expect(genre.id).toBeGreaterThan(0);
                
                await db.query(
                    'INSERT IGNORE INTO anime_genres (anime_id, genre_id) VALUES (?, ?)',
                    [anime.id, genre.id]
                );
            }
        }

        // Verify genres
        const genres = await Anime.getGenres(anime.id);
        expect(genres.length).toBeGreaterThanOrEqual(detail.genres?.length || 0);
    });

    test('should sync studios to database', async () => {
        const detail = await anilistApi.getAnime(testAnimeId);
        const anime = await Anime.findByAnilistId(testAnimeId);
        expect(anime).toBeDefined();

        if (detail.studios?.nodes) {
            for (const studioData of detail.studios.nodes) {
                const studio = await Studio.upsert({
                    name: studioData.name,
                    site_url: studioData.siteUrl,
                    is_animation_studio: true
                });
                expect(studio).toBeDefined();
                expect(studio.id).toBeGreaterThan(0);
                
                await db.query(
                    'INSERT IGNORE INTO anime_studios (anime_id, studio_id) VALUES (?, ?)',
                    [anime.id, studio.id]
                );
            }
        }

        // Verify studios
        const studios = await Anime.getStudios(anime.id);
        expect(studios.length).toBeGreaterThanOrEqual(detail.studios?.nodes?.length || 0);
    });

    test('should get anime from database with full details', async () => {
        const fullAnime = await Anime.findFullByAnilistId(testAnimeId);
        expect(fullAnime).toBeDefined();
        expect(fullAnime.anilist_id).toBe(testAnimeId);
        expect(fullAnime.genre_names).toBeDefined();
        expect(fullAnime.studio_names).toBeDefined();
    });
});
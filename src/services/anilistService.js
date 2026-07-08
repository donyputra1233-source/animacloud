// src/services/anilistService.js
const anilistApi = require('../config/anilistApi');
const { Anime, Genre, Studio, Character, Staff, Recommendation, StreamingLink, ExternalLink } = require('../models');
const db = require('../config/database');

class AnilistService {
    // ============================================
    // CONSTRUCTOR
    // ============================================
    constructor() {
        // Tidak ada inisialisasi khusus
    }

    // ============================================
    // EXISTING METHODS (V1)
    // ============================================

    // SEARCH ANIME
    async searchAnime(query, limit = 10, offset = 0) {
        if (!query) throw new Error('Query pencarian wajib diisi');
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.searchAnime(query, page, perPage);
        return this.formatAnimeList(data);
    }

    // GET ANIME DETAIL
    async getAnimeDetail(anilistId) {
        if (!anilistId) throw new Error('ID anime wajib diisi');
        const data = await anilistApi.getAnime(anilistId);
        if (!data) throw new Error(`Anime dengan ID ${anilistId} tidak ditemukan`);
        return this.formatAnimeDetail(data);
    }

    // GET TRENDING
    async getTrending(limit = 10, offset = 0) {
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.getTrending(page, perPage);
        return this.formatAnimeList(data);
    }

    // GET POPULAR
    async getPopular(limit = 10, offset = 0) {
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.getPopular(page, perPage);
        return this.formatAnimeList(data);
    }

    // GET SEASONAL
    async getSeasonal(season, year, limit = 10, offset = 0) {
        if (!season || !year) throw new Error('Parameter season dan year wajib diisi');
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.getSeasonal(season, year, page, perPage);
        return this.formatAnimeList(data);
    }

    // GET BY FILTER
    async getAnimeByFilter(filters, limit = 10, offset = 0) {
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.getAnimeByFilter(filters, page, perPage);
        return this.formatAnimeList(data);
    }

    // GET STUDIO
    async getStudio(studioId) {
        if (!studioId) throw new Error('ID studio wajib diisi');
        const data = await anilistApi.getStudio(studioId);
        return {
            id: data.id,
            name: data.name,
            siteUrl: data.siteUrl,
            isAnimationStudio: data.isAnimationStudio,
            anime: data.media?.nodes?.map(item => ({
                id: item.id,
                title: item.title?.romaji || item.title?.english,
                coverImage: item.coverImage?.large,
                score: item.averageScore
            })) || []
        };
    }

    // SYNC ANIME TO DATABASE
    async syncAnimeToDatabase(anilistId, includeRelations = false) {
        const detail = await this.getAnimeDetail(anilistId);
        if (!detail) throw new Error(`Anime dengan ID ${anilistId} tidak ditemukan di AniList`);

        const animeData = {
            anilist_id: detail.id,
            title_romaji: detail.title,
            title_english: detail.titleEnglish,
            title_native: detail.titleNative,
            synopsis: detail.description ? detail.description.substring(0, 5000) : null,
            description: detail.description,
            cover_image_large: detail.image,
            cover_image_medium: detail.image,
            cover_image_color: detail.color,
            banner_image: detail.banner,
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
            start_date: detail.startDate,
            end_date: detail.endDate
        };

        const existing = await Anime.findByAnilistId(anilistId);
        let animeId;

        if (existing) {
            await Anime.update(existing.id, animeData);
            animeId = existing.id;
            console.log(`✅ Updated anime: ${detail.title} (ID: ${animeId})`);
        } else {
            animeId = await Anime.create(animeData);
            console.log(`✅ Inserted anime: ${detail.title} (ID: ${animeId})`);
        }

        // Sync genres
        if (detail.genres && detail.genres.length > 0) {
            await db.query('DELETE FROM anime_genres WHERE anime_id = ?', [animeId]);
            for (const genreName of detail.genres) {
                const genre = await Genre.upsert(genreName);
                await db.query('INSERT IGNORE INTO anime_genres (anime_id, genre_id) VALUES (?, ?)', [animeId, genre.id]);
            }
            console.log(`   ✅ Synced ${detail.genres.length} genres`);
        }

        // Sync studios
        if (detail.studios && detail.studios.length > 0) {
            await db.query('DELETE FROM anime_studios WHERE anime_id = ?', [animeId]);
            for (const studioData of detail.studios) {
                const studio = await Studio.upsert({
                    anilist_id: studioData.id || null,
                    name: studioData.name,
                    site_url: studioData.siteUrl,
                    is_animation_studio: studioData.isAnimationStudio !== false
                });
                await db.query('INSERT IGNORE INTO anime_studios (anime_id, studio_id) VALUES (?, ?)', [animeId, studio.id]);
            }
            console.log(`   ✅ Synced ${detail.studios.length} studios`);
        }

        if (includeRelations) {
            // Sync characters
            if (detail.characters && detail.characters.length > 0) {
                for (const charData of detail.characters) {
                    const character = await Character.upsert({
                        anilist_id: charData.id,
                        name_full: charData.name,
                        image_large: charData.image
                    });
                    await Character.addToAnime(animeId, character.id, charData.role, charData.voiceActors?.[0] || null);
                }
                console.log(`   ✅ Synced ${detail.characters.length} characters`);
            }

            // Sync staff
            if (detail.staff && detail.staff.length > 0) {
                for (const staffData of detail.staff) {
                    const staff = await Staff.upsert({
                        anilist_id: staffData.id,
                        name_full: staffData.name,
                        image_large: staffData.image
                    });
                    await Staff.addToAnime(animeId, staff.id, staffData.role);
                }
                console.log(`   ✅ Synced ${detail.staff.length} staff`);
            }
        }

        await Anime.update(animeId, { last_synced_at: new Date().toISOString() });
        return { animeId, detail };
    }

    // BULK SYNC
    async syncMultiple(anilistIds, includeRelations = false) {
        const results = [];
        for (const id of anilistIds) {
            try {
                const result = await this.syncAnimeToDatabase(id, includeRelations);
                results.push(result);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`❌ Failed to sync anime ${id}:`, error.message);
                results.push({ id, error: error.message });
            }
        }
        return results;
    }

    // ============================================
    // FORMATTERS
    // ============================================

    formatAnimeList(data) {
        if (!data || !data.media) return [];
        return data.media.map(item => ({
            id: item.id,
            title: item.title?.romaji || 'Unknown',
            titleEnglish: item.title?.english || null,
            titleNative: item.title?.native || null,
            image: item.coverImage?.large || item.coverImage?.medium || null,
            color: item.coverImage?.color || null,
            banner: item.bannerImage || null,
            score: item.averageScore || null,
            popularity: item.popularity || null,
            episodes: item.episodes || 0,
            status: item.status || 'Unknown',
            format: item.format || 'TV',
            genres: item.genres || [],
            studios: item.studios?.nodes?.map(s => s.name) || [],
            season: item.season || null,
            seasonYear: item.seasonYear || null,
            nextEpisode: item.nextAiringEpisode?.episode || null,
            nextAiringAt: item.nextAiringEpisode?.airingAt || null,
            siteUrl: item.siteUrl || null,
            source: 'anilist'
        }));
    }

    formatAnimeDetail(data) {
        if (!data) return null;
        return {
            id: data.id,
            title: data.title?.romaji || 'Unknown',
            titleEnglish: data.title?.english || null,
            titleNative: data.title?.native || null,
            image: data.coverImage?.extraLarge || data.coverImage?.large || null,
            color: data.coverImage?.color || null,
            banner: data.bannerImage || null,
            description: data.description || null,
            episodes: data.episodes || 0,
            duration: data.duration || 0,
            status: data.status || 'Unknown',
            format: data.format || 'TV',
            source: data.source || null,
            averageScore: data.averageScore || null,
            meanScore: data.meanScore || null,
            popularity: data.popularity || null,
            favourites: data.favourites || null,
            trending: data.trending || null,
            genres: data.genres || [],
            studios: data.studios?.nodes?.map(s => ({
                id: s.id,
                name: s.name,
                siteUrl: s.siteUrl,
                isAnimationStudio: s.isAnimationStudio
            })) || [],
            startDate: data.startDate ? `${data.startDate.year}-${String(data.startDate.month).padStart(2, '0')}-${String(data.startDate.day).padStart(2, '0')}` : null,
            endDate: data.endDate ? `${data.endDate.year}-${String(data.endDate.month).padStart(2, '0')}-${String(data.endDate.day).padStart(2, '0')}` : null,
            season: data.season || null,
            seasonYear: data.seasonYear || null,
            siteUrl: data.siteUrl || null,
            trailer: data.trailer ? { id: data.trailer.id, site: data.trailer.site, thumbnail: data.trailer.thumbnail } : null,
            rankings: data.rankings?.map(r => ({ rank: r.rank, type: r.type, context: r.context })) || [],
            nextAiringEpisode: data.nextAiringEpisode ? { episode: data.nextAiringEpisode.episode, airingAt: data.nextAiringEpisode.airingAt } : null,
            characters: data.characters?.edges?.map(edge => ({
                id: edge.node.id,
                name: edge.node.name?.full || 'Unknown',
                image: edge.node.image?.large || null,
                role: edge.role || 'SUPPORTING',
                voiceActors: edge.voiceActors?.map(va => ({ id: va.id, name: va.name?.full || 'Unknown', image: va.image?.large || null })) || []
            })) || [],
            staff: data.staff?.edges?.map(edge => ({
                id: edge.node.id,
                name: edge.node.name?.full || 'Unknown',
                image: edge.node.image?.large || null,
                role: edge.role || 'Staff'
            })) || [],
            recommendations: data.recommendations?.nodes?.map(item => ({
                id: item.mediaRecommendation?.id || null,
                title: item.mediaRecommendation?.title?.romaji || null,
                titleEnglish: item.mediaRecommendation?.title?.english || null,
                coverImage: item.mediaRecommendation?.coverImage?.large || null,
                score: item.mediaRecommendation?.averageScore || null
            })) || [],
            relations: data.relations?.edges?.map(edge => ({
                id: edge.node.id,
                title: edge.node.title?.romaji || edge.node.title?.english,
                coverImage: edge.node.coverImage?.large,
                format: edge.node.format,
                status: edge.node.status,
                relationType: edge.relationType
            })) || [],
            streamingEpisodes: data.streamingEpisodes?.map(ep => ({ title: ep.title, thumbnail: ep.thumbnail, url: ep.url, site: ep.site })) || [],
            externalLinks: data.externalLinks?.map(link => ({ url: link.url, site: link.site, type: link.type })) || [],
            source: 'anilist'
        };
    }

    // ============================================
    // V2 METHODS (Advanced)
    // ============================================

    async advancedSearch(filters, limit = 10, offset = 0) {
        const { search, genre, status, format } = filters;
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        
        let query = `
            query ($page: Int, $perPage: Int${search ? ', $search: String' : ''}${genre ? ', $genre: String' : ''}${status ? ', $status: MediaStatus' : ''}${format ? ', $format: MediaFormat' : ''}) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo { total currentPage lastPage hasNextPage }
                    media(
                        ${search ? 'search: $search,' : ''}
                        ${genre ? 'genre: $genre,' : ''}
                        ${status ? 'status: $status,' : ''}
                        ${format ? 'format: $format,' : ''}
                        type: ANIME, sort: POPULARITY_DESC
                    ) {
                        id
                        title { romaji english native }
                        coverImage { large color }
                        bannerImage
                        episodes
                        status
                        averageScore
                        popularity
                        genres
                        studios { nodes { name } }
                        format
                        season
                        seasonYear
                    }
                }
            }
        `;
        
        const variables = { page, perPage, search, genre, status, format };
        const data = await anilistApi.query(query, variables);
        return this.formatAnimeList(data.Page);
    }

    async getFullDetail(anilistId) {
        return await this.getAnimeDetail(anilistId);
    }

    async getSuggestions(limit = 10) {
        const data = await anilistApi.getSuggestions(limit);
        return this.formatAnimeList(data);
    }

    async getAnimeByFilterV2(filters, limit = 10, offset = 0) {
        const page = Math.floor(offset / limit) + 1;
        const perPage = Math.min(limit, 20);
        const data = await anilistApi.getAnimeByFilter(filters, page, perPage);
        return this.formatAnimeList(data);
    }
}

module.exports = new AnilistService();
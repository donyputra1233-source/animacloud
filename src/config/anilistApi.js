const axios = require('axios');
require('dotenv').config();

class AnilistApi {
    constructor() {
        this.baseURL = process.env.ANILIST_API_URL || 'https://graphql.anilist.co';
        this.clientId = process.env.ANILIST_CLIENT_ID;
        this.clientSecret = process.env.ANILIST_CLIENT_SECRET;
        this.redirectUri = process.env.ANILIST_REDIRECT_URI;
        
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    }

    // === GRAPHQL QUERY ===
    async query(query, variables = {}) {
        try {
            const response = await this.api.post('', {
                query: query,
                variables: variables
            });
            
            if (response.data.errors) {
                console.error('GraphQL Errors:', response.data.errors);
                throw new Error(response.data.errors[0].message);
            }
            
            return response.data.data;
        } catch (error) {
            console.error('AniList API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    // === SEARCH ANIME ===
    async searchAnime(search, page = 1, perPage = 10) {
        const query = `
            query ($search: String, $page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            medium
                            color
                        }
                        bannerImage
                        description(asHtml: false)
                        episodes
                        status
                        averageScore
                        popularity
                        favourites
                        genres
                        studios {
                            nodes {
                                name
                                siteUrl
                            }
                        }
                        startDate {
                            year
                            month
                            day
                        }
                        endDate {
                            year
                            month
                            day
                        }
                        format
                        source
                        duration
                        season
                        seasonYear
                        siteUrl
                        trailer {
                            id
                            site
                            thumbnail
                        }
                        rankings {
                            rank
                            type
                            context
                        }
                        meanScore
                        trending
                        nextAiringEpisode {
                            episode
                            airingAt
                        }
                    }
                }
            }
        `;
        
        const variables = { search, page, perPage };
        const data = await this.query(query, variables);
        return data.Page;
    }

    // === GET ANIME BY ID ===
    async getAnime(id) {
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                    bannerImage
                    description(asHtml: false)
                    episodes
                    status
                    averageScore
                    meanScore
                    popularity
                    favourites
                    trending
                    genres
                    studios {
                        nodes {
                            id
                            name
                            siteUrl
                            isAnimationStudio
                        }
                    }
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    format
                    source
                    duration
                    season
                    seasonYear
                    siteUrl
                    trailer {
                        id
                        site
                        thumbnail
                    }
                    rankings {
                        rank
                        type
                        context
                    }
                    nextAiringEpisode {
                        episode
                        airingAt
                    }
                    characters(sort: ROLE) {
                        edges {
                            node {
                                id
                                name {
                                    full
                                }
                                image {
                                    large
                                    medium
                                }
                            }
                            role
                            voiceActors {
                                id
                                name {
                                    full
                                }
                                image {
                                    large
                                    medium
                                }
                            }
                        }
                    }
                    staff {
                        edges {
                            node {
                                id
                                name {
                                    full
                                }
                                image {
                                    large
                                    medium
                                }
                            }
                            role
                        }
                    }
                    recommendations(sort: RATING_DESC, perPage: 5) {
                        nodes {
                            mediaRecommendation {
                                id
                                title {
                                    romaji
                                    english
                                }
                                coverImage {
                                    large
                                }
                                averageScore
                            }
                        }
                    }
                    relations {
                        edges {
                            relationType
                            node {
                                id
                                title {
                                    romaji
                                    english
                                }
                                coverImage {
                                    large
                                }
                                format
                                status
                            }
                        }
                    }
                    streamingEpisodes {
                        title
                        thumbnail
                        url
                        site
                    }
                    externalLinks {
                        url
                        site
                        type
                    }
                }
            }
        `;
        
        const variables = { id };
        const data = await this.query(query, variables);
        return data.Media;
    }

    // === GET TRENDING ANIME ===
    async getTrending(page = 1, perPage = 10) {
        const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(sort: TRENDING_DESC, type: ANIME, status: RELEASING) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            color
                        }
                        bannerImage
                        episodes
                        status
                        averageScore
                        popularity
                        genres
                        studios {
                            nodes {
                                name
                            }
                        }
                        season
                        seasonYear
                        nextAiringEpisode {
                            episode
                            airingAt
                        }
                    }
                }
            }
        `;
        
        const variables = { page, perPage };
        const data = await this.query(query, variables);
        return data.Page;
    }

    // === GET POPULAR ANIME ===
    async getPopular(page = 1, perPage = 10) {
        const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(sort: POPULARITY_DESC, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            color
                        }
                        bannerImage
                        episodes
                        status
                        averageScore
                        popularity
                        genres
                        studios {
                            nodes {
                                name
                            }
                        }
                        startDate {
                            year
                        }
                        format
                    }
                }
            }
        `;
        
        const variables = { page, perPage };
        const data = await this.query(query, variables);
        return data.Page;
    }

    // === GET SEASONAL ANIME ===
    async getSeasonal(season, year, page = 1, perPage = 10) {
        const query = `
            query ($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            color
                        }
                        bannerImage
                        episodes
                        status
                        averageScore
                        popularity
                        genres
                        studios {
                            nodes {
                                name
                            }
                        }
                        format
                        season
                        seasonYear
                    }
                }
            }
        `;
        
        const variables = { season, year, page, perPage };
        const data = await this.query(query, variables);
        return data.Page;
    }

    // === GET ANIME BY GENRE ===
    async getByGenre(genre, page = 1, perPage = 10) {
        const query = `
            query ($genre: String, $page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                        }
                        averageScore
                        episodes
                        status
                        genres
                        format
                        seasonYear
                    }
                }
            }
        `;
        
        const variables = { genre, page, perPage };
        const data = await this.query(query, variables);
        return data.Page;
    }

    // === GET STUDIO BY ID ===
    async getStudio(id) {
        const query = `
            query ($id: Int) {
                Studio(id: $id) {
                    id
                    name
                    siteUrl
                    isAnimationStudio
                    media(type: ANIME, sort: POPULARITY_DESC, perPage: 10) {
                        nodes {
                            id
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                large
                            }
                            averageScore
                        }
                    }
                }
            }
        `;
        
        const variables = { id };
        const data = await this.query(query, variables);
        return data.Studio;
    }
}

module.exports = new AnilistApi();
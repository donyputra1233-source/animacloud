// src/graphql/queries.js

/**
 * Query: Search Anime
 */
const SEARCH_ANIME = `
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
                description
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
                season
                seasonYear
                siteUrl
                trailer {
                    id
                    site
                    thumbnail
                }
                nextAiringEpisode {
                    episode
                    airingAt
                }
            }
        }
    }
`;

/**
 * Query: Get Anime by ID
 */
const GET_ANIME = `
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
            description
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

/**
 * Query: Trending Anime
 */
const GET_TRENDING = `
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

/**
 * Query: Popular Anime
 */
const GET_POPULAR = `
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

/**
 * Query: Seasonal Anime
 */
const GET_SEASONAL = `
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

/**
 * Query: Anime by Genre
 */
const GET_BY_GENRE = `
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

/**
 * Query: Studio by ID
 */
const GET_STUDIO = `
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

/**
 * Query: Anime Suggestions
 */
const GET_SUGGESTIONS = `
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
            }
            media(sort: POPULARITY_DESC, type: ANIME, status: RELEASING) {
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
                genres
                format
            }
        }
    }
`;

module.exports = {
    SEARCH_ANIME,
    GET_ANIME,
    GET_TRENDING,
    GET_POPULAR,
    GET_SEASONAL,
    GET_BY_GENRE,
    GET_STUDIO,
    GET_SUGGESTIONS
};
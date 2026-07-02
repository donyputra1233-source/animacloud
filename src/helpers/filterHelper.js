// src/helpers/filterHelper.js
const { isValidAnimeStatus, isValidAnimeFormat, isValidSeason } = require('../utils/validator');

/**
 * Build filter object for Anime queries
 */
const buildAnimeFilters = (filters) => {
    const result = {};

    // Status filter
    if (filters.status && isValidAnimeStatus(filters.status)) {
        result.status = filters.status.toUpperCase();
    }

    // Format filter
    if (filters.format && isValidAnimeFormat(filters.format)) {
        result.format = filters.format.toUpperCase();
    }

    // Season filter
    if (filters.season && isValidSeason(filters.season)) {
        result.season = filters.season.toUpperCase();
    }

    // Season year
    if (filters.seasonYear && !isNaN(parseInt(filters.seasonYear))) {
        result.seasonYear = parseInt(filters.seasonYear);
    }

    // Genre
    if (filters.genre) {
        result.genre = filters.genre.trim();
    }

    // Studio
    if (filters.studio) {
        result.studio = filters.studio.trim();
    }

    // Search query
    if (filters.search) {
        result.search = filters.search.trim();
    }

    // Score range
    if (filters.minScore && !isNaN(parseInt(filters.minScore))) {
        result.minScore = parseInt(filters.minScore);
    }
    if (filters.maxScore && !isNaN(parseInt(filters.maxScore))) {
        result.maxScore = parseInt(filters.maxScore);
    }

    // Sort
    if (filters.sortBy) {
        const validSortFields = ['popularity', 'average_score', 'trending', 'favourites', 'created_at', 'updated_at'];
        if (validSortFields.includes(filters.sortBy)) {
            result.sortBy = filters.sortBy;
        }
    }

    // Sort order
    if (filters.sortOrder) {
        result.sortOrder = filters.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    return result;
};

/**
 * Build filter object for AniList queries
 */
const buildAnilistFilters = (filters) => {
    const result = {};

    if (filters.status) result.status = filters.status.toUpperCase();
    if (filters.season) result.season = filters.season.toUpperCase();
    if (filters.seasonYear) result.seasonYear = parseInt(filters.seasonYear);
    if (filters.genres) result.genres = filters.genres;
    if (filters.rating) result.rating = parseInt(filters.rating);
    if (filters.year) result.year = parseInt(filters.year);
    if (filters.ageRating) result.ageRating = filters.ageRating;
    if (filters.popularity) result.popularity = true;
    if (filters.ratingSort) result.ratingSort = true;

    return result;
};

/**
 * Get filter operators for SQL queries
 */
const getFilterOperators = (filterType) => {
    const operators = {
        eq: '=',
        ne: '!=',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<=',
        like: 'LIKE',
        in: 'IN'
    };
    return operators[filterType] || '=';
};

/**
 * Build WHERE clause from filters
 */
const buildWhereClause = (filters, tableAlias = '') => {
    const conditions = [];
    const values = [];
    const prefix = tableAlias ? `${tableAlias}.` : '';

    for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined) continue;

        switch (key) {
            case 'search':
                conditions.push(`(${prefix}title_romaji LIKE ? OR ${prefix}title_english LIKE ? OR ${prefix}synopsis LIKE ?)`);
                const searchTerm = `%${value}%`;
                values.push(searchTerm, searchTerm, searchTerm);
                break;
            case 'minScore':
                conditions.push(`${prefix}average_score >= ?`);
                values.push(value);
                break;
            case 'maxScore':
                conditions.push(`${prefix}average_score <= ?`);
                values.push(value);
                break;
            case 'genre':
                conditions.push(`${prefix}id IN (SELECT anime_id FROM anime_genres ag JOIN genres g ON ag.genre_id = g.id WHERE g.name = ?)`);
                values.push(value);
                break;
            case 'studio':
                conditions.push(`${prefix}id IN (SELECT anime_id FROM anime_studios ast JOIN studios s ON ast.studio_id = s.id WHERE s.name = ?)`);
                values.push(value);
                break;
            default:
                conditions.push(`${prefix}${key} = ?`);
                values.push(value);
        }
    }

    return {
        where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
        values
    };
};

module.exports = {
    buildAnimeFilters,
    buildAnilistFilters,
    getFilterOperators,
    buildWhereClause
};
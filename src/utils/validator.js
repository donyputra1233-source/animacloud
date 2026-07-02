// src/utils/validator.js

/**
 * Validasi apakah string kosong
 */
const isEmpty = (value) => {
    if (!value) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
};

/**
 * Validasi email
 */
const isValidEmail = (email) => {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Validasi URL
 */
const isValidUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validasi angka positif
 */
const isPositiveNumber = (num) => {
    if (!num) return false;
    const n = parseFloat(num);
    return !isNaN(n) && n >= 0;
};

/**
 * Validasi ID (angka positif)
 */
const isValidId = (id) => {
    return isPositiveNumber(id) && Number.isInteger(parseFloat(id));
};

/**
 * Validasi page dan limit untuk pagination
 */
const validatePagination = (page, limit) => {
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return { page: validPage, limit: validLimit };
};

/**
 * Validasi season
 */
const isValidSeason = (season) => {
    const validSeasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    return validSeasons.includes(season?.toUpperCase());
};

/**
 * Validasi status anime
 */
const isValidAnimeStatus = (status) => {
    const validStatus = ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'];
    return validStatus.includes(status?.toUpperCase());
};

/**
 * Validasi format anime
 */
const isValidAnimeFormat = (format) => {
    const validFormats = ['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'];
    return validFormats.includes(format?.toUpperCase());
};

/**
 * Sanitasi string (trim & remove multiple spaces)
 */
const sanitize = (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitasi query string
 */
const sanitizeQuery = (query) => {
    if (!query) return '';
    return query.trim().replace(/[^a-zA-Z0-9\s\-]/g, '');
};

/**
 * Validasi object memiliki field yang required
 */
const validateRequired = (data, requiredFields) => {
    const errors = [];
    for (const field of requiredFields) {
        if (isEmpty(data[field])) {
            errors.push(`Field "${field}" wajib diisi`);
        }
    }
    return errors;
};

module.exports = {
    isEmpty,
    isValidEmail,
    isValidUrl,
    isPositiveNumber,
    isValidId,
    validatePagination,
    isValidSeason,
    isValidAnimeStatus,
    isValidAnimeFormat,
    sanitize,
    sanitizeQuery,
    validateRequired
};
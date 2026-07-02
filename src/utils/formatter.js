// src/utils/formatter.js

/**
 * Format tanggal ke ISO string
 */
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Format angka dengan separator ribuan
 */
const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Truncate text dengan panjang tertentu
 */
const truncateText = (text, length = 100, suffix = '...') => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
};

/**
 * Clean HTML tags
 */
const cleanHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
};

/**
 * Extract number from string
 */
const extractNumber = (text) => {
    if (!text) return null;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
};

/**
 * Slugify string
 */
const slugify = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize first letter
 */
const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format anime status untuk ditampilkan
 */
const formatAnimeStatus = (status) => {
    const statusMap = {
        'FINISHED': 'Selesai',
        'RELEASING': 'Tayang',
        'NOT_YET_RELEASED': 'Akan Datang',
        'CANCELLED': 'Dibatalkan',
        'HIATUS': 'Hiatus'
    };
    return statusMap[status] || status;
};

/**
 * Format anime format untuk ditampilkan
 */
const formatAnimeFormat = (format) => {
    const formatMap = {
        'TV': 'TV Series',
        'TV_SHORT': 'TV Short',
        'MOVIE': 'Movie',
        'SPECIAL': 'Special',
        'OVA': 'OVA',
        'ONA': 'ONA',
        'MUSIC': 'Music',
        'MANGA': 'Manga',
        'NOVEL': 'Novel'
    };
    return formatMap[format] || format;
};

/**
 * Format season untuk ditampilkan
 */
const formatSeason = (season) => {
    const seasonMap = {
        'WINTER': 'Winter',
        'SPRING': 'Spring',
        'SUMMER': 'Summer',
        'FALL': 'Fall'
    };
    return seasonMap[season] || season;
};

/**
 * Format duration (menit) ke string
 */
const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

module.exports = {
    formatDate,
    formatNumber,
    truncateText,
    cleanHtml,
    extractNumber,
    slugify,
    capitalize,
    formatAnimeStatus,
    formatAnimeFormat,
    formatSeason,
    formatDuration
};
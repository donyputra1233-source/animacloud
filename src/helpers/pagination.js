// src/helpers/pagination.js

/**
 * Build pagination object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} baseUrl - Base URL untuk links
 */
const buildPagination = (page, limit, total, baseUrl = '') => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, parseInt(page) || 1);
    const perPage = Math.max(1, parseInt(limit) || 20);

    const result = {
        page: currentPage,
        limit: perPage,
        total: total || 0,
        totalPages: totalPages || 0,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };

    // Generate links
    if (baseUrl) {
        const base = baseUrl.includes('?') ? baseUrl + '&' : baseUrl + '?';
        result.links = {
            first: `${base}page=1&limit=${perPage}`,
            prev: currentPage > 1 ? `${base}page=${currentPage - 1}&limit=${perPage}` : null,
            next: currentPage < totalPages ? `${base}page=${currentPage + 1}&limit=${perPage}` : null,
            last: `${base}page=${totalPages}&limit=${perPage}`
        };
    }

    return result;
};

/**
 * Get offset from page and limit
 */
const getOffset = (page, limit) => {
    const currentPage = Math.max(1, parseInt(page) || 1);
    const perPage = Math.max(1, parseInt(limit) || 20);
    return (currentPage - 1) * perPage;
};

/**
 * Validate and normalize pagination params
 */
const normalizePagination = (page, limit, maxLimit = 100) => {
    const normalizedPage = Math.max(1, parseInt(page) || 1);
    const normalizedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));
    return {
        page: normalizedPage,
        limit: normalizedLimit,
        offset: (normalizedPage - 1) * normalizedLimit
    };
};

module.exports = {
    buildPagination,
    getOffset,
    normalizePagination
};
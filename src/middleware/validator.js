// src/middleware/validator.js
const { errorResponse } = require('../utils/responseHandler');
const { validatePagination, isValidSeason, isValidAnimeStatus, isValidAnimeFormat } = require('../utils/validator');

/**
 * Validate pagination parameters
 */
const validatePaginationMiddleware = (req, res, next) => {
    const { page, limit } = req.query;
    const result = validatePagination(page, limit);
    req.query.page = result.page;
    req.query.limit = result.limit;
    next();
};

/**
 * Validate anime status
 */
const validateAnimeStatus = (req, res, next) => {
    const { status } = req.query;
    if (status && !isValidAnimeStatus(status)) {
        return res.status(400).json(errorResponse(
            'Status tidak valid. Gunakan: FINISHED, RELEASING, NOT_YET_RELEASED, CANCELLED, HIATUS'
        ));
    }
    next();
};

/**
 * Validate anime format
 */
const validateAnimeFormat = (req, res, next) => {
    const { format } = req.query;
    if (format && !isValidAnimeFormat(format)) {
        return res.status(400).json(errorResponse(
            'Format tidak valid. Gunakan: TV, TV_SHORT, MOVIE, SPECIAL, OVA, ONA, MUSIC'
        ));
    }
    next();
};

/**
 * Validate season
 */
const validateSeason = (req, res, next) => {
    const { season } = req.query;
    if (season && !isValidSeason(season)) {
        return res.status(400).json(errorResponse(
            'Season tidak valid. Gunakan: WINTER, SPRING, SUMMER, FALL'
        ));
    }
    next();
};

/**
 * Validate search query
 */
const validateSearchQuery = (req, res, next) => {
    const { q } = req.query;
    if (!q || q.trim() === '') {
        return res.status(400).json(errorResponse('Parameter pencarian "q" wajib diisi'));
    }
    req.query.q = q.trim();
    next();
};

/**
 * Validate ID parameter
 */
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json(errorResponse('ID harus berupa angka'));
    }
    req.params.id = parseInt(id);
    next();
};

module.exports = {
    validatePaginationMiddleware,
    validateAnimeStatus,
    validateAnimeFormat,
    validateSeason,
    validateSearchQuery,
    validateId
};
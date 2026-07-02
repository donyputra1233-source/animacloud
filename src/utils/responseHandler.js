// src/utils/responseHandler.js

/**
 * Success Response
 * @param {string} message - Pesan sukses
 * @param {*} data - Data yang ingin dikirim
 * @param {*} pagination - Pagination info (opsional)
 */
const successResponse = (message, data = null, pagination = null) => {
    const response = {
        success: true,
        message: message || 'Success',
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    if (pagination !== null) {
        response.pagination = pagination;
    }

    return response;
};

/**
 * Error Response
 * @param {string} message - Pesan error
 * @param {*} error - Detail error (opsional)
 */
const errorResponse = (message, error = null) => {
    const response = {
        success: false,
        message: message || 'Error',
        timestamp: new Date().toISOString()
    };

    if (error !== null) {
        response.error = error;
    }

    return response;
};

/**
 * Paginated Response
 * @param {string} message - Pesan sukses
 * @param {*} data - Data
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Limit per halaman
 * @param {number} total - Total data
 */
const paginatedResponse = (message, data, page, limit, total) => {
    return {
        success: true,
        message: message || 'Success',
        data: data,
        pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            total: total || 0,
            totalPages: Math.ceil((total || 0) / (parseInt(limit) || 20))
        },
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};
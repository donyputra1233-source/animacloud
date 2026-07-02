// src/middleware/errorHandler.js
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    
    if (env.isDevelopment) {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    };

    if (env.isDevelopment) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
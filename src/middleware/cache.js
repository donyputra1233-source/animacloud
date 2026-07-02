// src/middleware/cache.js
const cacheService = require('../services/cacheService');

/**
 * Cache middleware
 * @param {number} ttl - Time to live in seconds
 */
const cache = (ttl = 3600) => {
    return async (req, res, next) => {
        // Skip cache jika bukan GET
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key dari URL + query
        const cacheKey = cacheService.generateKey(
            req.originalUrl || req.url
        );

        try {
            // Coba ambil dari cache
            const cachedData = await cacheService.get(cacheKey);
            
            if (cachedData !== null) {
                console.log(`✅ Cache hit: ${cacheKey}`);
                return res.status(200).json(cachedData);
            }

            // Simpan response asli
            const originalJson = res.json;
            res.json = function(data) {
                // Simpan ke cache
                cacheService.set(cacheKey, data, ttl)
                    .then(() => console.log(`💾 Cache set: ${cacheKey}`))
                    .catch(err => console.error('Cache set error:', err));
                
                // Kirim response
                originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error.message);
            next();
        }
    };
};

/**
 * Clear cache for specific pattern
 */
const clearCache = async (pattern) => {
    // Implementasi clear cache
    // Bisa menggunakan redis pattern matching
    console.log(`🧹 Clear cache pattern: ${pattern}`);
};

module.exports = {
    cache,
    clearCache
};
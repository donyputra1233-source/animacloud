// src/services/cacheService.js
const redis = require('../config/redis');
const env = require('../config/env');

class CacheService {
    constructor() {
        this.ttl = env.redis.ttl || 3600;
        this.enabled = env.isDevelopment ? false : true;
        this.prefix = 'animacloud:';
    }

    // === GET CACHE ===
    async get(key) {
        if (!this.enabled) return null;
        try {
            const data = await redis.get(this.prefix + key);
            return data;
        } catch (error) {
            console.error('Cache get error:', error.message);
            return null;
        }
    }

    // === SET CACHE ===
    async set(key, value, ttl = this.ttl) {
        if (!this.enabled) return false;
        try {
            return await redis.set(this.prefix + key, value, ttl);
        } catch (error) {
            console.error('Cache set error:', error.message);
            return false;
        }
    }

    // === DELETE CACHE ===
    async delete(key) {
        if (!this.enabled) return false;
        try {
            return await redis.delete(this.prefix + key);
        } catch (error) {
            console.error('Cache delete error:', error.message);
            return false;
        }
    }

    // === CLEAR ALL CACHE ===
    async clear() {
        if (!this.enabled) return false;
        try {
            return await redis.clear();
        } catch (error) {
            console.error('Cache clear error:', error.message);
            return false;
        }
    }

    // === GENERATE CACHE KEY ===
    generateKey(...parts) {
        return parts.join(':');
    }

    // === CACHE MIDDLEWARE HELPER ===
    async withCache(key, fn, ttl = this.ttl) {
        // Try to get from cache
        const cached = await this.get(key);
        if (cached !== null) {
            console.log(`✅ Cache hit: ${key}`);
            return cached;
        }

        // Execute function
        console.log(`🔄 Cache miss: ${key}`);
        const result = await fn();

        // Store in cache
        await this.set(key, result, ttl);

        return result;
    }
}

module.exports = new CacheService();
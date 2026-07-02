const redis = require('redis');
require('dotenv').config();

class RedisClient {
    constructor() {
        this.client = null;
        this.connected = false;
        this.ttl = parseInt(process.env.REDIS_CACHE_TTL) || 3600;
    }

    async connect() {
        if (this.connected) return this.client;

        try {
            this.client = redis.createClient({
                url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
                password: process.env.REDIS_PASSWORD || undefined,
                database: parseInt(process.env.REDIS_DB) || 0
            });

            this.client.on('error', (err) => {
                console.error('Redis Error:', err.message);
            });

            this.client.on('connect', () => {
                console.log('✅ Redis connected successfully');
                this.connected = true;
            });

            await this.client.connect();
            return this.client;
        } catch (error) {
            console.error('❌ Redis connection failed:', error.message);
            return null;
        }
    }

    async set(key, value, ttl = this.ttl) {
        try {
            if (!this.connected) await this.connect();
            await this.client.setEx(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Redis set error:', error.message);
            return false;
        }
    }

    async get(key) {
        try {
            if (!this.connected) await this.connect();
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis get error:', error.message);
            return null;
        }
    }

    async delete(key) {
        try {
            if (!this.connected) await this.connect();
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error('Redis delete error:', error.message);
            return false;
        }
    }

    async clear() {
        try {
            if (!this.connected) await this.connect();
            await this.client.flushDb();
            return true;
        } catch (error) {
            console.error('Redis clear error:', error.message);
            return false;
        }
    }

    async disconnect() {
        try {
            if (this.connected && this.client) {
                await this.client.quit();
                this.connected = false;
                console.log('Redis disconnected');
            }
        } catch (error) {
            console.error('Redis disconnect error:', error.message);
        }
    }
}

module.exports = new RedisClient();
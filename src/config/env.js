require('dotenv').config();

module.exports = {
    // Server
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // Database
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'animacloud_db'
    },

    // AniList
    anilist: {
        apiUrl: process.env.ANILIST_API_URL || 'https://graphql.anilist.co',
        clientId: process.env.ANILIST_CLIENT_ID,
        clientSecret: process.env.ANILIST_CLIENT_SECRET,
        redirectUri: process.env.ANILIST_REDIRECT_URI
    },

    // Redis
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: parseInt(process.env.REDIS_DB) || 0,
        ttl: parseInt(process.env.REDIS_CACHE_TTL) || 3600
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
        headers: process.env.CORS_HEADERS || 'Content-Type,Authorization'
    },

    // Rate Limit
    rateLimit: {
        windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log',
        maxSize: process.env.LOG_MAX_SIZE || '10m',
        maxFiles: parseInt(process.env.LOG_MAX_FILES) || 7
    },

    // Sync
    sync: {
        batchSize: parseInt(process.env.SYNC_BATCH_SIZE) || 10,
        delay: parseInt(process.env.SYNC_DELAY_MS) || 500,
        maxRetries: parseInt(process.env.SYNC_MAX_RETRIES) || 3
    }
};
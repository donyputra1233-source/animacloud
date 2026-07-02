// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');

const app = express();
const PORT = env.port || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS
app.use(cors({
    origin: env.cors.origin || '*',
    methods: env.cors.methods || 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: env.cors.headers || 'Content-Type,Authorization'
}));

// Logging
if (env.isDevelopment) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// JSON Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (kecuali development)
if (!env.isDevelopment) {
    const limiter = rateLimit({
        windowMs: env.rateLimit.windowMs || 15 * 60 * 1000,
        max: env.rateLimit.max || 100,
        message: {
            success: false,
            message: 'Too many requests, please try again later.'
        }
    });
    app.use('/api', limiter);
}

// ============================================
// ROUTES
// ============================================

// API Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: env.env,
        source: 'AniList'
    });
});

// Root
app.get('/', (req, res) => {
    res.json({
        name: 'Animacloud-API',
        status_1: 'OK',
        status_2: 'Running',
        condition: 'Healthy',
        version: '1.0.0',
        description: 'Animacloud-API is a RESTful API that provides anime data from AniList.',
        documentation: '/api/v1',
        endpoints: {
            anime: '/api/v1/anime',
            anilist: '/api/v1/anilist',
            genres: '/api/v1/genres',
            sync: '/api/v1/sync'
        },
        timestamp: new Date().toISOString()
        
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Animacloud-API Server`);
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${env.env}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/v1`);
    console.log('========================================');
});

module.exports = app;
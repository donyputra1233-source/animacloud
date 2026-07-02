// src/services/index.js
const animeService = require('./animeService');
const anilistService = require('./anilistService');
const syncService = require('./syncService');
const cacheService = require('./cacheService');

module.exports = {
    animeService,
    anilistService,
    syncService,
    cacheService
};
const database = require('./database');
const anilistApi = require('./anilistApi');
const redis = require('./redis');
const env = require('./env');

module.exports = {
    database,
    anilistApi,
    redis,
    env
};
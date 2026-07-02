// src/utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// Buat folder logs jika belum ada
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Konfigurasi Winston
const logger = winston.createLogger({
    level: env.logging.level || 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'animacloud-api' },
    transports: [
        // Error log
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),
        // Combined log
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

// Jika development, tambahkan console
if (env.isDevelopment) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
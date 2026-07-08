// src/routes/index.js
const express = require('express');
const router = express.Router();

const v1Routes = require('./v1');
const v2Routes = require('./v2');

// API Version 1 (Basic) - DEPRECATED
router.use('/v1', v1Routes);

// API Version 2 (Advanced) - RECOMMENDED
router.use('/v2', v2Routes);

// API Info
router.get('/', (req, res) => {
    res.json({
        name: 'Animacloud-API',
        version: '2.0.0',
        documentation: '/api',
        endpoints: {
            v1: '/api/v1 (deprecated)',
            v2: '/api/v2 (recommended)'
        }
    });
});

module.exports = router;
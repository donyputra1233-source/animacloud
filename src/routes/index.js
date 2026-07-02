// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import semua versi routes
const v1Routes = require('./v1');

// API Version 1 (Basic)
router.use('/v1', v1Routes);

// API Version 2 (Extended) - akan ditambahkan nanti
// const v2Routes = require('./v2');
// router.use('/v2', v2Routes);

// API Version 3 (Advanced) - akan ditambahkan nanti
// const v3Routes = require('./v3');
// router.use('/v3', v3Routes);

module.exports = router;
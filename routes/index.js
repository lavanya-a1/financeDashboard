const express = require('express');
const router = express.Router();

const testRoutes = require('./testRoutes');

router.use('/test', testRoutes);

const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);

module.exports = router;
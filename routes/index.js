const express = require('express');
const router = express.Router();

const testRoutes = require('./testRoutes');

router.use('/test', testRoutes);

const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);

const recordRoutes = require('./recordRoutes');

router.use('/records', recordRoutes);

const dashboardRoutes = require('./dashboardRoutes');

router.use('/dashboard', dashboardRoutes);

module.exports = router;
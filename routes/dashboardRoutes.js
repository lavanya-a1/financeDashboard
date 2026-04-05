const express = require('express');
const router = express.Router();

const {
  summary,
  category,
  trends,
} = require('../controllers/dashboardController');

const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Viewer + Analyst + Admin
router.get('/summary', authenticate, authorize('viewer', 'analyst', 'admin'), summary);
router.get('/category', authenticate, authorize('analyst', 'admin'), category);
router.get('/trends', authenticate, authorize('analyst', 'admin'), trends);

module.exports = router;
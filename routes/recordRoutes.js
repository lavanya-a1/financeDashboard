const express = require('express');
const router = express.Router();

const {
  create,
  getAll,
  update,
  remove,
} = require('../controllers/recordController');

const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Admin only
router.post('/', authenticate, authorize('admin'), create);
router.patch('/:id', authenticate, authorize('admin'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

// Analyst + Admin
router.get('/', authenticate, authorize('analyst', 'admin'), getAll);

module.exports = router;
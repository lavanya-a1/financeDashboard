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
const { validate } = require('../middlewares/validateMiddleware');
const { recordSchema } = require('../validations/recordValidation');

// Admin only
router.post('/', authenticate, authorize('admin'), validate(recordSchema), create);
router.patch('/:id', authenticate, authorize('admin'), validate(recordSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

// Analyst + Admin
router.get('/', authenticate, authorize('analyst', 'admin'), getAll);

module.exports = router;
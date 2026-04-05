const express = require('express');
const router = express.Router();

const {
  listUsers,
  changeUserRole,
  changeUserStatus,
} = require('../controllers/userController');

const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const {
  updateUserRoleSchema,
  updateUserStatusSchema,
} = require('../validations/userValidation');

router.get('/', authenticate, authorize('admin'), listUsers);
router.patch('/:id/role', authenticate, authorize('admin'), validate(updateUserRoleSchema), changeUserRole);
router.patch('/:id/status', authenticate, authorize('admin'), validate(updateUserStatusSchema), changeUserStatus);

module.exports = router;

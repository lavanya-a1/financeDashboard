const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} = require('../services/userService');

exports.listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const updatedUser = await updateUserRole(req.params.id, req.body.role);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};

exports.changeUserStatus = async (req, res) => {
  try {
    const updatedUser = await updateUserStatus(req.params.id, req.body.is_active);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};

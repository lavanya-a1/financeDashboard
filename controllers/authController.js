const { registerUser, loginUser } = require('../services/authService');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(409).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.message === 'User is inactive') {
      return res.status(403).json({ error: err.message });
    }

    res.status(401).json({ error: err.message });
  }
};
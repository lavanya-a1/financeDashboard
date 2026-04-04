const { registerUser, loginUser } = require('../services/authService');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
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
    res.status(401).json({ error: err.message });
  }
};
const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, is_active`,
      [name, email, hashedPassword, 'viewer', true]
    );

    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      throw new Error('Email already in use');
    }

    throw err;
  }
};

exports.loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error('User not found');
  if (user.is_active === false) throw new Error('User is inactive');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};
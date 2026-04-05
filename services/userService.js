const pool = require('../config/db');

exports.getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, is_active
     FROM users
     ORDER BY id ASC`
  );

  return result.rows;
};

exports.updateUserRole = async (id, role) => {
  const result = await pool.query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, name, email, role, is_active`,
    [role, id]
  );

  if (!result.rows[0]) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

exports.updateUserStatus = async (id, isActive) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $1
     WHERE id = $2
     RETURNING id, name, email, role, is_active`,
    [isActive, id]
  );

  if (!result.rows[0]) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

const pool = require('../config/db');

// CREATE
exports.createRecord = async (data, userId) => {
  const { amount, type, category, date, note } = data;

  const result = await pool.query(
    `INSERT INTO financial_records (user_id, amount, type, category, date, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, amount, type, category, date, note]
  );

  return result.rows[0];
};

// GET ALL (with filters)
exports.getRecords = async (filters) => {
  let query = `SELECT * FROM financial_records WHERE 1=1`;
  let values = [];
  let index = 1;

  // Filters
  if (filters.type) {
    query += ` AND type = $${index++}`;
    values.push(filters.type);
  }

  if (filters.category) {
    query += ` AND category = $${index++}`;
    values.push(filters.category);
  }

  if (filters.startDate && filters.endDate) {
    query += ` AND date BETWEEN $${index++} AND $${index++}`;
    values.push(filters.startDate, filters.endDate);
  }

  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 5;
  const offset = (page - 1) * limit;

  query += ` ORDER BY date DESC LIMIT $${index++} OFFSET $${index++}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);

  return {
    page,
    limit,
    data: result.rows
  };
};

// UPDATE
exports.updateRecord = async (id, data) => {
  const { amount, type, category, date, note } = data;

  const result = await pool.query(
    `UPDATE financial_records
     SET amount=$1, type=$2, category=$3, date=$4, note=$5
     WHERE id=$6
     RETURNING *`,
    [amount, type, category, date, note, id]
  );

  return result.rows[0];
};

// DELETE
exports.deleteRecord = async (id) => {
  await pool.query(`DELETE FROM financial_records WHERE id=$1`, [id]);
};
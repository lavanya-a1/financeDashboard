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
  let query = `SELECT * FROM financial_records WHERE 1=1 AND is_deleted = FALSE`;
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

  if (filters.search) {
    query += ` AND (category ILIKE $${index} OR COALESCE(note, '') ILIKE $${index})`;
    values.push(`%${filters.search}%`);
    index++;  
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

// UPDATE (Partial)
exports.updateRecord = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (['amount', 'type', 'category', 'date', 'note'].includes(key)) {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE financial_records
    SET ${fields.join(', ')}
    WHERE id = $${index} AND is_deleted = FALSE
    RETURNING *`;

  const result = await pool.query(query, values);
  if (!result.rows[0]) {
    throw new Error('Record not found');
  }

  return result.rows[0];
};

// DELETE
exports.deleteRecord = async (id) => {
  const result = await pool.query(
    `UPDATE financial_records
     SET is_deleted = TRUE
     WHERE id = $1 AND is_deleted = FALSE
     RETURNING id`,
    [id]
  );

  if (!result.rows[0]) {
    throw new Error('Record not found');
  }
};

const pool = require('../config/db');

// Total income, expense, balance
exports.getSummary = async () => {
  const result = await pool.query(`
    SELECT 
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense
    FROM financial_records
    WHERE is_deleted = FALSE
  `);

  const data = result.rows[0];

  return {
    total_income: Number(data.total_income) || 0,
    total_expense: Number(data.total_expense) || 0,
    net_balance:
      (Number(data.total_income) || 0) -
      (Number(data.total_expense) || 0),
  };
};

// Category-wise totals
exports.getCategoryBreakdown = async () => {
  const result = await pool.query(`
    SELECT category, SUM(amount) AS total
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY category
    ORDER BY total DESC
  `);

  return result.rows;
};

// Monthly trends
exports.getMonthlyTrends = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', date) AS month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY month
    ORDER BY month
  `);

  return result.rows;
};
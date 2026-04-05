const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
} = require('../services/dashboardService');

exports.summary = async (req, res) => {
  try {
    const data = await getSummary();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.category = async (req, res) => {
  try {
    const data = await getCategoryBreakdown();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.trends = async (req, res) => {
  try {
    const data = await getMonthlyTrends();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
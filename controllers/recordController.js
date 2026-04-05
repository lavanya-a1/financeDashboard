const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require('../services/recordService');

exports.create = async (req, res) => {
  try {
    const record = await createRecord(req.body, req.user.id);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await getRecords(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await updateRecord(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    if (err.message === 'Record not found') {
      return res.status(404).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await deleteRecord(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    if (err.message === 'Record not found') {
      return res.status(404).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};
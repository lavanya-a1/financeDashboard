const Joi = require('joi');

exports.recordSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().min(2).max(50).required(),
  date: Joi.date().required(),
  note: Joi.string().allow('').optional()
});
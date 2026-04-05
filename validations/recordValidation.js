const Joi = require('joi');

const baseRecordSchema = {
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().min(2).max(50).required(),
  date: Joi.date().required(),
  note: Joi.string().allow('').optional()
};

exports.recordSchema = Joi.object(baseRecordSchema);

exports.recordUpdateSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().min(2).max(50),
  date: Joi.date(),
  note: Joi.string().allow('')
}).min(1);
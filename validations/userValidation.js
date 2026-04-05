const Joi = require('joi');

exports.updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('viewer', 'analyst', 'admin').required()
});

exports.updateUserStatusSchema = Joi.object({
  is_active: Joi.boolean().required()
});

const Joi = require("joi");

const LoginSchema = Joi.object({
  login: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(3).required(),
});

const UpdateLoginSchema = Joi.object({
  oldLogin: Joi.string().min(3).max(20).required(),
  newLogin: Joi.string().min(3).max(20).required(),
});

module.exports = { LoginSchema, UpdateLoginSchema };

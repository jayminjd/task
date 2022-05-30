const Joi = require("joi");

const validateUser = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).min(10).required(),
  address: Joi.string().required(),
});

module.exports = { validateUser };

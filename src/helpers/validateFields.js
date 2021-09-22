const Joi = require('joi');

const CustomError = require('../CustomError/CustomError');

const newUserValidation = (request) => {
  const { error } = Joi.object({
    name: Joi.string().not().empty().required(),
    password: Joi.string().not().empty().required(),
    email: Joi
      .string()
      .email()
      .not()
      .empty()
      .required(),
  }).validate(request);

  if (error) throw new CustomError('Invalid entries. Try again.', 400);
};

const loginValidation = (request) => {
  const { error } = Joi.object({
    password: Joi.string().not().empty().required(),
    email: Joi
      .string()
      .email()
      .not()
      .empty()
      .required(),
  }).validate(request);

  if (error) throw new CustomError('All fields must be filled', 401);
};

module.exports = {
  newUserValidation,
  loginValidation,
};
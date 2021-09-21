const Joi = require('joi');
const rescue = require('express-rescue');
const userService = require('../services/userService');
const CustomError = require('../CustomError/CustomError');

const isValidFields = (request) => {
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

const create = rescue(async (req, res) => {
  isValidFields(req.body);

  const { name, email, password } = req.body;
  const result = await userService.create({ name, email, password, role: 'user' });
  res.status(201).json(result);
});

module.exports = {
  create,
};
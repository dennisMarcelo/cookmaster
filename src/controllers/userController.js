const Joi = require('joi');
const rescue = require('express-rescue');
const userService = require('../services/userService');
const CustomError = require('../CustomError/CustomError');

// validations
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

// middlewares
const create = rescue(async (req, res) => {
  newUserValidation(req.body);

  const { name, email, password } = req.body;
  const result = await userService.create({ name, email, password, role: 'user' });
  res.status(201).json(result);
});

const login = rescue(async (req, res) => {
  loginValidation(req.body);

  const { email, password } = req.body;
  const token = await userService.login({ email, password });

  res.status(200).json(token);
});

module.exports = {
  create,
  login,
};
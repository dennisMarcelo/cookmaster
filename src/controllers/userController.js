const rescue = require('express-rescue');
const userService = require('../services/userService');

const { newUserValidation, loginValidation } = require('../helpers/validateFields');

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

const createNewAdmin = rescue(async (req, res) => {
  newUserValidation(req.body);

  const { name, email, password } = req.body;
  const result = await userService.create({ name, email, password, role: 'admin' });
  res.status(201).json(result);
});

module.exports = {
  createNewAdmin,
  create,
  login,
};
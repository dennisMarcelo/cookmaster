const userModel = require('../models/usersModel');
const CustomError = require('../CustomError/CustomError');
const { tokenGenerator } = require('../helpers/token');

const create = async ({ name, email, password, role }) => {
  const user = await userModel.findUserByEmail(email);
  if (user) throw new CustomError('Email already registered', 409);

  const result = await userModel.create({ name, email, password, role });
  return result;
};

const login = async ({ email, password }) => {
  const userOfDatabase = await userModel.findUserByEmail(email);
  
  if (!userOfDatabase) throw new CustomError('Incorrect username or password', 401);

  if (userOfDatabase.email !== email || userOfDatabase.password !== password) {
    throw new CustomError('Incorrect username or password', 401);
  }

  const token = tokenGenerator(userOfDatabase);

  return { token };
};

module.exports = {
  create,
  login,
};
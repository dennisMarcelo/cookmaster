const userModel = require('../models/usersModel');
const CustomError = require('../CustomError/CustomError');

const create = async ({ name, email, password, role }) => {
  const existEmail = await userModel.findByEmail(email);
  console.log(existEmail);
  if (existEmail) throw new CustomError('Email already registered', 409);

  const result = await userModel.create({ name, email, password, role });
  return result;
};

module.exports = {
  create,
};
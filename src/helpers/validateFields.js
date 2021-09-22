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

const newRecipeValidation = (recipe) => {
  const { error } = Joi.object({
    name: Joi.string().not().empty().required(),
    ingredients: Joi.string().not().empty().required(),
    preparation: Joi.string().not().empty().required(),
  }).validate(recipe);

  if (error) throw new CustomError('Invalid entries. Try again.', 400);
};

const isValiId = (params) => {
  const { error } = Joi.object({ 
    id: Joi
      .string()
      .hex()
      .length(24)
      .not()
      .empty()
      .required(),
  }).validate(params);

  if (error) {
    throw new CustomError('recipe not found', 404);
  } 
};

module.exports = {
  newUserValidation,
  loginValidation,
  newRecipeValidation,
  isValiId,
};
const rescue = require('express-rescue');

const { newRecipeValidation } = require('../helpers/validateFields');
const recipesService = require('../services/recipesService');

const create = rescue(async (req, res) => {
  newRecipeValidation(req.body);
  
  const { name, ingredients, preparation } = req.body;
  const { userId } = req.user;

  const newRecipe = await recipesService.create({ name, ingredients, preparation, userId });

  res.status(201).json({ recipe: newRecipe });
});

const getAll = rescue(async (_req, res) => {
  const allRecipes = await recipesService.getAll();

  res.status(200).json(allRecipes);
});

module.exports = {
  create,
  getAll,
};
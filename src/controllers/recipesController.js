const rescue = require('express-rescue');

const { newRecipeValidation } = require('../helpers/validateFields');
const recipesController = require('../services/recipesService');

const create = rescue(async (req, res) => {
  newRecipeValidation(req.body);
  
  const { name, ingredients, preparation } = req.body;
  const { userId } = req.user;
  console.log(userId);

  const newRecipe = await recipesController.create({ name, ingredients, preparation, userId });

  res.status(201).json({ recipe: newRecipe });
});

module.exports = {
  create,
};
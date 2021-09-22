const recipesModel = require('../models/recipesModel');

const create = async (recipe) => {
  const newRecipe = await recipesModel.create(recipe);
  console.log(newRecipe);
  return newRecipe;
};

module.exports = {
  create,
};
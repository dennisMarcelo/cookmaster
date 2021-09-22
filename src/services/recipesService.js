const recipesModel = require('../models/recipesModel');

const create = async (recipe) => {
  const newRecipe = await recipesModel.create(recipe);
  return newRecipe;
};

const getAll = async () => {
 const allRecipes = await recipesModel.getAll();

 return allRecipes;
};

module.exports = {
  create,
  getAll,
};
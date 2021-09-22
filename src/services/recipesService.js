const recipesModel = require('../models/recipesModel');

const create = async (recipe) => {
  const newRecipe = await recipesModel.create(recipe);
  
  return newRecipe;
};

const getAll = async () => {
 const allRecipes = await recipesModel.getAll();

 return allRecipes;
};

const getById = async (id) => {
  const recipe = await recipesModel.getById(id);

  return recipe;
};

module.exports = {
  create,
  getAll,
  getById,
};
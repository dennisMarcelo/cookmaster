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

const update = async (id, userId, newRecipe) => {
  const recipeUpdated = await recipesModel.update(id, userId, newRecipe);

  return recipeUpdated;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
};
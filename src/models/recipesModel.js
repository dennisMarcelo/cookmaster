const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

const getConnetionWithRecipesColletion = async () => {
  const db = await getConnection();
  const collectionUser = await db.collection('recipes');

  return collectionUser;
};

const create = async (recipe) => {
  const colletionRecipes = await getConnetionWithRecipesColletion();
  const { insertedId: _id } = await colletionRecipes.insertOne({ ...recipe });

  return {
    ...recipe, _id,
  };
};

const getAll = async () => {
  const colletionRecipes = await getConnetionWithRecipesColletion();
  const allRecipes = await colletionRecipes.find().toArray();

  return allRecipes;
};

const getById = async (id) => {
  const colletionRecipes = await getConnetionWithRecipesColletion();
  const recipe = await colletionRecipes.findOne(ObjectId(id));

  return recipe;
};

module.exports = {
  create,
  getAll,
  getById,
};
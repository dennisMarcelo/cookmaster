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

module.exports = {
  create,
};
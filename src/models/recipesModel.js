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

const update = async (id, userId, newRecipe) => {
  const colletionRecipes = await getConnetionWithRecipesColletion();

  await colletionRecipes.updateOne(
    { _id: ObjectId(id) },
    { 
      $set: { 
        name: newRecipe.name, 
        ingredients: newRecipe.ingredients, 
        preparation: newRecipe.preparation, 
      }, 
    },
    { upsert: false },
  );

  return {
    _id: id,
    ...newRecipe,
    userId,
  };
};

const remove = async (id) => {
  const colletionRecipes = await getConnetionWithRecipesColletion();
  const { result } = await colletionRecipes.deleteOne({ _id: ObjectId(id) });
  
  if (result.n > 0) return true;
  return false;
};

const addImage = async (id, imageUrl) => {
  const colletionRecipes = await getConnetionWithRecipesColletion();
  const { result } = await colletionRecipes.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        image: imageUrl,
      },
    },
  );
  
  if (result.nModified > 0) {
    return true;
  }

  return false;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  addImage,
};
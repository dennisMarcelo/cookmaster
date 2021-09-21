const { getConnection } = require('./connection');

const getConnetionWithUserColletion = async () => {
  const db = await getConnection();
  const collectionUser = await db.collection('users');

  return collectionUser;
};

const create = async ({ name, email, password, role }) => {
  const colletionUser = await getConnetionWithUserColletion();
  const { insertedId: _id } = await colletionUser.insertOne({ name, email, password, role });

  return {
    user: {
      name, email, role, _id,
    },
  };
};

const findByEmail = async (email) => {
  const colletionUser = await getConnetionWithUserColletion();
  const user = await colletionUser.findOne({ email });
  
  if (user) return true;
  return false;
};

module.exports = {
  create,
  findByEmail,
};
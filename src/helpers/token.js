const jwt = require('jsonwebtoken');

const tokenGenerator = (userOfDatabase) => {
  const { email, role, _id } = userOfDatabase;
  console.log(email, role, _id);

  // projeto real utilizar vaiável de ambiente
  const secretKey = 'forever wakanda';
  const jwtConfig = {
    expiresIn: '1h',
    algorithm: 'HS256',
  };

  return jwt.sign({ email, role, _id }, secretKey, jwtConfig);
};

module.exports = {
  tokenGenerator,
};
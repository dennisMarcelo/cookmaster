const jwt = require('jsonwebtoken');

const secretKey = 'forever wakanda';

const validateJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'jwt malformed' });

  try {
    const decoded = jwt.decode(token, secretKey);
    const { email, role, _id: userId } = decoded;

    req.user = { email, role, userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = {
  validateJWT,
};

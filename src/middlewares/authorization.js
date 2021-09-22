const jwt = require('jsonwebtoken');

const recipesModel = require('../models/recipesModel');

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

const isAdminOrUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'missing auth token' });
    
  try {
    const decoded = jwt.decode(token, secretKey);
    const { email, role, _id: userId } = decoded;

    const { id } = req.params;
    const recipe = await recipesModel.getById(id);
    
    if (role === 'admin' || recipe.userId === userId) {
      req.user = { email, role, userId };
      return next();
    }
    
    return res.status(401).json({ message: 'jwt malformed' });
  } catch (err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = {
  validateJWT,
  isAdminOrUser,
};

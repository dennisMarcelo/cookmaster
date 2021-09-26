const jwt = require('jsonwebtoken');

const recipesModel = require('../models/recipesModel');

const secretKey = 'forever wakanda';
const message = 'jwt malformed';

const validateJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message });

  try {
    const decoded = jwt.decode(token, secretKey);
    const { email, role, _id: userId } = decoded;

    req.user = { email, role, userId };
    next();
  } catch (err) {
    return res.status(401).json({ message });
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
      req.user = { email, role, userId: recipe.userId };
      req.recipe = recipe;
      return next();
    }
    
    return res.status(401).json({ message });
  } catch (err) {
    return res.status(401).json({ message });
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can register new admins' });
  }
  
  next();
};

module.exports = {
  validateJWT,
  isAdminOrUser,
  isAdmin,
};

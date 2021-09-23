const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

const userController = require('../controllers/userController');
const recipesController = require('../controllers/recipesController');
const errorMiddleware = require('../middlewares/error');
const { validateJWT, isAdminOrUser } = require('../middlewares/authorization');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../uploads')));

// config multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'image/jpeg') {
    req.fileValidationError = true;
    return cb(null, false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, path.join(__dirname, '../uploads')); },
  filename: (req, file, cb) => { 
    req.imageUrl = `localhost:3000/src/uploads/${req.params.id}.jpeg`;
    cb(null, `${req.params.id}.jpeg`); 
  },
});

const uploadFile = multer({ fileFilter, storage });

// Não remover esse end-point, ele é necessário para o avaliador / R: não removido
app.get('/', (request, response) => {
  response.send();
});

app.route('/users')
  .post(userController.create);

app.route('/login')
  .post(userController.login);

app.route('/recipes')
  .post(validateJWT, recipesController.create)
  .get(recipesController.getAll);

app.route('/recipes/:id')
  .get(recipesController.getById)
  .put(isAdminOrUser, recipesController.update)
  .delete(isAdminOrUser, recipesController.remove);

app.route('/recipes/:id/image/')
  .put(isAdminOrUser, uploadFile.single('image'), recipesController.addImage);

app.use(errorMiddleware);

module.exports = app;

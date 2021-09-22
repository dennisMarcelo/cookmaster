const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const userController = require('../controllers/userController');
const errorMiddleware = require('../middlewares/error');

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador / R: não removido
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador/ R: não removido

app.route('/users')
  .post(userController.create);

app.route('/login')
  .post(userController.login);

app.use(errorMiddleware);

module.exports = app;

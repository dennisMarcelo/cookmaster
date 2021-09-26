const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const {getConnection, DBServer} = require('./connect')
const fs = require('fs')
const path = require('path');

const server  = require('../api/app');

const DB_NAME = 'Cookmaster';
const recipeId1 = '6432ef45abaa7234551f25c1';
const recipeId2 = '1232ffeb23ba57234551faf4';
const userId = '614bf57bb41a7734551f85c1';
const userId2 = '11fbf47bb41a77345b1faf23';
const user1 = {name:"t'challa", email: 'black@panther.marvel.com', password:'wakanda forever'};
const recipe1 = {
  name: 'grilled fish',
  ingredients: 'fish oil',
  preparation: 'fry the fish until golden'
}
const recipe2 = {
  name: 'boiled fish',
  ingredients: 'fish, water, tomato',
  preparation: 'boil fish with all ingredients'
}

describe('Recipes routes', ()=>{
  describe('recipe created with success return', async()=>{
    let response = {};
    let token = null;
    let connection = null
    
    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('users')
      .insertOne({
        _id: userId,
        name: user1.name,
        email: user1.email,
        password: user1.password,
        role: 'user'
      });
      
      token = await chai.request(server)
        .post('/login')
        .send({ email: user1.email, password: user1.password })
        .then((res) => res.body.token);

      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send(recipe1)
    });

    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      await connection.db(DB_NAME).collection('recipes').drop();
      MongoClient.connect.restore();
    });

    it('status code 201', () => {
      expect(response).to.have.status(201);
    });

    it('data about new recipe', () => {
      expect(response.body.recipe.name).to.equal(recipe1.name);
      expect(response.body.recipe.ingredients).to.equal(recipe1.ingredients);
      expect(response.body.recipe.preparation).to.equal(recipe1.preparation);
      expect(response.body.recipe.userId).to.equal(userId);
      expect(response.body.recipe).to.have.property('_id');
    })
  });

  describe('recipe with fields invalid return', () => {
    let response = {};
    let connection = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('users')
      .insertOne({
        _id: userId,
        name: user1.name,
        email: user1.email,
        password: user1.password,
        role: 'user'
      });
      
      token = await chai.request(server)
        .post('/login')
        .send({ email: user1.email, password: user1.password })
        .then((res) => res.body.token);

      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({})
    });

    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    });

    it('status code 201', () => {  
      expect(response).to.have.status(400);
    });

    it('message with text have informating the error', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  });

  describe('route for get all recipes returns', () =>{
    let response = {};
    let connection = null
    
    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('recipes')
      .insertMany([
        {
          _id: recipeId1,
          name: recipe1.name,
          ingredients: recipe1.ingredients,
          preparation: recipe1.preparation,
          userId: userId,
        },
        {
          _id: recipeId2,
          name: recipe2.name,
          ingredients: recipe2.ingredients,
          preparation: recipe2.preparation,
          userId: userId,
        }
      ]);

      response = await chai.request(server)
        .get('/recipes')

    });

    after(async () => {
      await connection.db(DB_NAME).collection('recipes').drop();
      MongoClient.connect.restore();
    });

    it('status 200', () => {
      expect(response).to.have.status(200);
    });

    it('one array with all recipes', () => {
      expect(response.body).to.be.an('array');
      expect(response.body).to.be.length(2);
    });
  });

  describe('route for get recipe by id return', () => {
    let response = {};
    let connection = null
    
    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('recipes')
      .insertMany([
        {
          _id: ObjectId(recipeId1),
          name: recipe1.name,
          ingredients: recipe1.ingredients,
          preparation: recipe1.preparation,
          userId: userId,
        },
        {
          _id: ObjectId(recipeId2),
          name: recipe2.name,
          ingredients: recipe2.ingredients,
          preparation: recipe2.preparation,
          userId: userId,
        }
      ]);

      response = await chai.request(server)
        .get(`/recipes/${recipeId2}`)

    });

    after(async () => {
      await connection.db(DB_NAME).collection('recipes').drop();
      MongoClient.connect.restore();
    });

    it('status 200', async () => {
      expect(response).to.have.status(200);
    });

    it('one object with recipe details', () => {
      expect(response.body).to.be.an('object');
      expect(response.body._id).to.be.equal(recipeId2);
      expect(response.body.name).to.be.equal(recipe2.name);
      expect(response.body.ingredients).to.be.equal(recipe2.ingredients);
      expect(response.body.preparation).to.be.equal(recipe2.preparation);
      expect(response.body.userId).to.be.equal(userId);
    });
  })

  describe('recipe updated by admin return', () => {
    let response = {};
    let connection = null;
    let token = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('recipes')
      .insertOne(
        {
          _id: ObjectId(recipeId1),
          name: recipe1.name,
          ingredients: recipe1.ingredients,
          preparation: recipe1.preparation,
          userId: userId,
        }
      );

      await connection.db(DB_NAME)
      .collection('users')
      .insertOne({
        _id: userId2,
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin123456',
        role: 'admin'
      });

      token = await chai.request(server)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin123456' })
      .then((res) => res.body.token);

      response = await chai.request(server)
        .put(`/recipes/${recipeId1}`)
        .set('authorization', token)
        .send({ name: 'edited', ingredients: 'edited', preparation: 'edited' })
    });

    after(async () => {
      await connection.db(DB_NAME).collection('recipes').drop();
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    });

    it('status 200', async () => {
      expect(response).to.have.status(200);
    });

    it('one object with recipe details', () => {
      expect(response.body).to.be.an('object');
      expect(response.body._id).to.be.equal(recipeId1);
      expect(response.body.name).to.be.equal('edited');
      expect(response.body.ingredients).to.be.equal('edited');
      expect(response.body.preparation).to.be.equal('edited');
      expect(response.body.userId).to.be.equal(userId);
    });
  });

  describe('recipe deleted by admin return', () => {
    let response = {};
    let connection = null;
    let token = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('recipes')
      .insertOne(
        {
          _id: ObjectId(recipeId1),
          name: recipe1.name,
          ingredients: recipe1.ingredients,
          preparation: recipe1.preparation,
          userId: userId,
        }
      );

      await connection.db(DB_NAME)
      .collection('users')
      .insertOne({
        _id: userId2,
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin123456',
        role: 'admin'
      });

      token = await chai.request(server)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin123456' })
      .then((res) => res.body.token);

      response = await chai.request(server)
        .delete(`/recipes/${recipeId1}`)
        .set('authorization', token)

    });

    after(async () => {
      await connection.db(DB_NAME).collection('recipes').drop();
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    });

    it('status 200', async () => {
      expect(response).to.have.status(204);
    });
  });

  describe('recipe deleted by admin return', () => {
    let response = {};
    let connection = null;
    let token = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
      .collection('recipes')
      .insertOne(
        {
          _id: ObjectId(recipeId1),
          name: recipe1.name,
          ingredients: recipe1.ingredients,
          preparation: recipe1.preparation,
          userId: userId,
        }
      );

      await connection.db(DB_NAME)
      .collection('users')
      .insertOne({
        _id: userId2,
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin123456',
        role: 'admin'
      });

      token = await chai.request(server)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin123456' })
      .then((res) => res.body.token);
  
      let image = fs.readFileSync(path.resolve(__dirname, '../uploads/ratinho.jpg'));
   
      response = await chai.request(server)
        .put(`/recipes/${recipeId1}/image`)
        .set('authorization', token)
        .attach('image', image, 'ratinho.jpg');

    });

    after(async () => {
      await connection.db(DB_NAME).collection('recipes').drop();
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    });

    it('status 200', async () => {
      expect(response).to.have.status(200);
    });

    it ('one object with recipe details', () => {
      expect(response.body._id).to.be.equal(recipeId1)
      expect(response.body.name).to.be.equal(recipe1.name);
      expect(response.body.ingredients).to.be.equal(recipe1.ingredients);
      expect(response.body.preparation).to.be.equal(recipe1.preparation);
      expect(response.body.userId).to.be.equal(userId);
      expect(response.body.image).to.be.equal(`localhost:3000/src/uploads/${recipeId1}.jpeg`);
    })
  });
})

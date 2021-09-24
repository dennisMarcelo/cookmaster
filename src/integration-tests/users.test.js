const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const {getConnection, DBServer} = require('./connect')

const server  = require('../api/app');

chai.use(chaiHttp);

const DB_NAME = 'Cookmaster';
const idFake = '614bf57bb41a7734551f85c1';
const user1 = {name:"t'challa", email: 'black@panther.marvel.com', password:'wakanda forever'};

describe('User routes', () => {
  describe('user created with success return', () => {
    let response = {};
    let connection = null
    
    before(async () => {
      connection = await getConnection()

      sinon.stub(MongoClient, 'connect').resolves(connection);
      
      response = await chai.request(server)
        .post('/users')
        .send(user1)
    })
  
    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    })

    it('status code 201', () => {
      expect(response).to.have.status(201);
    });

    it('object in the body', () => {
      expect(response.body).to.be.a('object');
    });

    it('data about new user', () => {
      expect(response.body.user.name).to.be.equal(user1.name);
      expect(response.body.user.email).to.be.equal(user1.email);
      expect(response.body.user.role).to.be.equal("user");
      expect(response.body.user).to.have.property('_id');
    });
  });

  describe('login with success return', () => {
    let response = {};
    let connection = null;
    
    before(async () => {
      connection = await getConnection()

      sinon.stub(MongoClient, 'connect').resolves(connection);
      
      await connection.db(DB_NAME)
        .collection('users')
        .insertOne({
          _id: idFake,
          name: user1.name,
          email: user1.email,
          password: user1.password,
          role: 'user'
        });
      
        response = await chai.request(server)
          .post('/login')
          .send({ email: user1.email, password: user1.password });
    });
  
    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    });
  
    it('status code 200', async () => {

      expect(response).to.have.status(200);
    });

    it('token as an answer', () => {
      expect(response.body).to.have.property('token');
    });
  });

});
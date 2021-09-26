const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const {getConnection, DBServer} = require('./connect');

const server  = require('../api/app');

chai.use(chaiHttp);

const DB_NAME = 'Cookmaster';
const idFake = '614bf57bb41a7734551f85c1';
const user1 = {name:"t'challa", email: 'black@panther.marvel.com', password:'wakanda forever'};

describe('Admin route', () => {
  describe('user admin add new user as admin and return', () => {
    let response = {};
    let connection = null
    let token = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
        .collection('users')
        .insertOne({
          _id: idFake,
          name: 'admin',
          email: 'admin@admin.com',
          password: 'adminSuperAdmin',
          role: 'admin'
        });

      token = await chai.request(server)
        .post('/login')
        .send({email:'admin@admin.com', password: 'adminSuperAdmin'})
        .then((res) => res.body.token);
      
      response = await chai.request(server)
        .post('/users/admin')
        .set('authorization', token)
        .send(user1);
    })

    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    })

    it('status 201', () => {
      expect(response).to.be.status(201);
    })

    it('object with details about new admin user', () => {
      expect(response.body.user.name).to.be.equal(user1.name);
      expect(response.body.user.email).to.be.equal(user1.email);
      expect(response.body.user.role).to.be.equal("admin");
      expect(response.body.user).to.have.property('_id');
    })
  });

  describe('normal user can\'t add new user and return', () => {
    let response = {};
    let connection = null
    let token = null;

    before(async () => {
      connection = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connection);

      await connection.db(DB_NAME)
        .collection('users')
        .insertOne({
          _id: idFake,
          name: 'admin',
          email: 'admin@admin.com',
          password: 'adminSuperAdmin',
          role: 'user'
        });

      token = await chai.request(server)
        .post('/login')
        .send({email:'admin@admin.com', password: 'adminSuperAdmin'})
        .then((res) => res.body.token);
      
      response = await chai.request(server)
        .post('/users/admin')
        .set('authorization', token)
        .send(user1);
    })

    after(async () => {
      await connection.db(DB_NAME).collection('users').drop();
      MongoClient.connect.restore();
    })

    it('status 403', () => {
      expect(response).to.be.status(403);
    })

    it('object with details about new admin user', () => {
      expect(response.body.message).to.be.equal('Only admins can register new admins');
     
    })
  });
})
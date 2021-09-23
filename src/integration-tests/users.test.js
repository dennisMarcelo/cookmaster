const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer} = require('mongodb-memory-server');

const server  = require('../api/app');

chai.use(chaiHttp);

const user1= {name:"t'challa", email: 'black@panther.marvel.com', password:'wakanda forever'}

describe('User routes', () => {
  const DBServer = new MongoMemoryServer();

  before(async () => {
    console.log('1');
    const URLMock = await DBServer.getUri();
    const connectionMock = await MongoClient.connect(URLMock, {
      useNewUrlParser: true, useUnifiedTopology: true,
    });

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  })

  after(async () => {
    console.log('2');
    MongoClient.connect.restore();
    await DBServer.stop();
  })

  describe('user created with success return', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send(user1)
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
});

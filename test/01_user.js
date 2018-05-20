const request = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('../src/index');
const config = require('config');

const agent = request.agent(server);
const options = config.get('jwt');
const authToken = jwt.sign({"name": "this is unittest"}, options.secret);

describe('UserController', () => {
  after(function() {
    server.close();
  });

  describe('GET /Users', () => {
    it('Empty User List', (done) => {
      agent
        .get('/users')
        .set('Authorization', `jwt ${authToken}`)
        .expect(200)
        .expect([], done);

    });

    it('Unauthorized', (done) => {
      agent
        .get('/users')
        .expect(401, done);
    });
  });

  describe('GET /Users/:id', () => {
    it('Empty User Info', (done) => {
      agent
        .get('/users/1')
        .set('Authorization', `jwt ${authToken}`)
        .expect(200)
        .expect({userid: 1}, done);

    });

    it('Unauthorized', (done) => {
      agent
        .get('/users/1')
        .expect(401, done);
    });
  });
});
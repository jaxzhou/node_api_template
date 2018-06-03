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
    it('获取用户列表', (done) => {
      agent
        .get('/users')
        .set('Authorization', `jwt ${authToken}`)
        .expect(200)
        .expect([], done);

    });

    it('ErrorHandler:401 Unauthorized', (done) => {
      agent
        .get('/users')
        .expect(401, done);
    });
  });

  describe('POST /Users', () => {
    it('添加用户', (done) => {
      const userdata = {name: 'testuser'};
      agent
        .post('/users')
        .set('Authorization', `jwt ${authToken}`)
        .send(userdata)
        .expect(200)
        .expect(userdata, done);
    });

    it('ErrorHandler:400 提交的数据有错误', (done) => {
      agent
        .post('/users')
        .set('Authorization', `jwt ${authToken}`)
        .expect(400, done);
    });

    it('ErrorHandler:401 Unauthorized', (done) => {
      agent
        .post('/users')
        .expect(401, done);
    });
  });

  describe('GET /Users/:id', () => {
    it('获取用户信息', (done) => {
      agent
        .get('/users/1')
        .set('Authorization', `jwt ${authToken}`)
        .expect(200)
        .expect({userid: 1}, done);

    });

    it('ErrorHandler:404 NotFound', (done) => {
      agent
        .get('/users/null')
        .set('Authorization', `jwt ${authToken}`)
        .expect(404)
        .expect({
          error: "Not Found",
          statusCode: 404,
          message: '未找到用户'
        }, done);
    });

    it('ErrorHandler:404 NotFound en', (done) => {
      agent
        .get('/users/null')
        .set('Authorization', `jwt ${authToken}`)
        .set('Cookie', ['locale=en-US'])
        .expect(404)
        .expect({
          error: "Not Found",
          statusCode: 404,
          message: 'User Not Found'
        }, done);
    });

    it('ErrorHandler:401 Unauthorized', (done) => {
      agent
        .get('/users/1')
        .expect(401, done);
    });
  });
});
const request = require('supertest');
const server = require('../src/index');
const agent = request.agent(server);

describe('验证服务启动', () => {
  after(function() {
    server.close();
  });

  it('获取服务信息', (done) => {
    agent
      .get('/version')
      .expect(200)
      .expect('2.0.0', done);
  });
});
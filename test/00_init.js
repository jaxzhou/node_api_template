import chai from 'chai';
import co from 'co';
import fs from 'fs';
import _ from 'lodash';
import 'babel-polyfill';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import api from '../src/servers/api';
import Models from '../src/models';

const should = chai.should();
chai.use(chaiHttp);

describe('验证服务启动', () => {
  const server = api.server;
  it('获取服务信息', (done) => {
    chai.request(server)
      .get('/version')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
import { assert } from 'chai';
import supertest from 'supertest';
import server from '../../../server';
import pkg from '../../../../../package.json'; // eslint-disable-line

function request() {
  return supertest(server.listen());
}

describe('API: v1/version', () => {
  it('should return a json response', (done) => {
    request()
      .get('/api/v1/version')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should respond with name, version and env.', (done) => {
    request()
    .get('/api/v1/version')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect((res) => {
      res.body.name = 'boldr-dx';
      res.body.version = pkg.version;
      res.body.env = process.env.NODE_ENV;
    })
    .expect(200, done);
  });
});

const request = require('supertest');
const app = require('../lib/handlers');

describe('test home page', () => {
  it('should give the home page', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect('content-type', 'text/html')
      .expect(200, done);
  });
});

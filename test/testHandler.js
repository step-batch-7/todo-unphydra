const request = require('supertest');
const app = require('../lib/handlers');
const database = require('./resource/database.json');
describe('test server', () => {
  describe('get home page', () => {
    it('should give the home page', done => {
      request(app.serve.bind(app))
        .get('/')
        .expect('content-type', 'text/html')
        .expect(200, done);
    });
  });

  describe('GET', () => {
    it('should get allTodos', done => {
      request(app.serve.bind(app))
        .get('/status')
        .expect('content-type', 'application/json')
        .expect(JSON.stringify(database))
        .expect(200, done);
    });
  });

  describe('POST', () => {
    it('should add a todo with the given titile', done => {
      request(app.serve.bind(app))
        .post('/title')
        .send({ title: 'abcde' })
        .set('Accept', 'application/json')
        .expect('content-type', 'application/json')
        .expect(/{"title":"abcde","id":[0-9]+,"items":\[\]}/)
        .expect(200, done);
    });
  });
});

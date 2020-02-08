const request = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');
const fs = require('fs');
const app = require('../lib/handlers');
const database = require('./resource/database.json');
describe('test server', () => {
  let fakeWriteFile;
  let dir;
  let clock;
  before(() => {
    fakeWriteFile = sinon.fake();
    sinon.replace(fs, 'writeFileSync', fakeWriteFile);
    dir = __dirname;
    clock = sinon.useFakeTimers(new Date(2016, 11, 1).getTime());
  });
  after(() => {
    sinon.restore();
  });
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
        .expect(200)
        .end(() => {
          const path = `${dir}/resource/database.json`;
          database['1480530600000'] = {
            title: 'abcde',
            id: 1480530600000,
            items: [],
            noOfItem: 0
          };
          sinon.assert.calledOnce(fakeWriteFile);
          assert.ok(
            fakeWriteFile.calledWithExactly(path, JSON.stringify(database))
          );
          done();
        });
    });
  });
});

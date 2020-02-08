const request = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');
const fs = require('fs');
const app = require('../lib/handlers');
const database = require('./resource/database.json');
describe('test server', () => {
  let fakeWriteFile, dir, clock, path;
  beforeEach(() => {
    fakeWriteFile = sinon.fake();
    sinon.replace(fs, 'writeFileSync', fakeWriteFile);
    dir = __dirname;
    clock = sinon.useFakeTimers(new Date(2016, 11, 1).getTime());
    path = `${dir}/resource/database.json`;
  });

  afterEach(() => {
    clock.restore();
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
        .expect(/{"title":"abcde","id":1480530600000,"items":\[\]}/)
        .expect(200)
        .end(() => {
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
          // console.log(
          //   Object.getOwnPropertyDescriptors(fakeWriteFile).args
          // '{"1581081897614":{"title":"test","id":1581081897614,"items":[{"name":"task 1","id":"1581081897614:0","status":false}],"noOfItem":5},"1480530600000":{"title":"abcde","id":1480530600000,"items":[],"noOfItem":0}}'
          // );
          done();
        });
    });

    it('should add an item to the particular todo', done => {
      const expected = new RegExp(
        '{"id":1480530600000,' +
          '"item":{"name":"task","id":"1480530600000:0","status":false}}'
      );
      request(app.serve.bind(app))
        .post('/addItem')
        .send({ id: 1480530600000, item: 'task' })
        .set('Accept', 'application/json')
        .expect('content-type', 'application/json')
        .expect(expected)
        .expect(200)
        .end(() => {
          database['1480530600000'].items.push({
            name: 'task',
            id: '1480530600000:0',
            status: false
          });
          database['1480530600000'].noOfItem = 1;
          sinon.assert.calledOnce(fakeWriteFile);
          assert.ok(
            fakeWriteFile.calledWithExactly(path, JSON.stringify(database))
          );
          done();
        });
    });

    it('should update an item name', done => {
      const expected = new RegExp(
        '{"id":1480530600000,' +
          '"item":{"name":"update","id":"1480530600000:0","status":false}}'
      );
      request(app.serve.bind(app))
        .post('/updateItem')
        .send({ id: '1480530600000:0', item: 'update' })
        .set('Accept', 'application/json')
        .expect('content-type', 'application/json')
        .expect(expected)
        .expect(200)
        .end(() => {
          database['1480530600000'].items[0].name = 'update';
          sinon.assert.calledOnce(fakeWriteFile);
          assert.ok(
            fakeWriteFile.calledWithExactly(path, JSON.stringify(database))
          );
          done();
        });
    });

    it('should delete an item from the todo', done => {
      request(app.serve.bind(app))
        .post('/deleteItem')
        .send({ id: '1480530600000:0' })
        .set('Accept', 'application/json')
        .expect('content-type', 'application/json')
        .expect(200, done);
    });
  });
});

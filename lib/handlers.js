const fs = require('fs');
const querystring = require('querystring');
const App = require('./app');
const List = require('./list');
const CONTENT_TYPES = require('./mimeTypes');
const config = require('./config');

const todoStore = config.DATA_STORE;
const STATIC_FOLDER = `${__dirname}/../public`;

const data = JSON.parse(fs.readFileSync(todoStore, 'utf8'));

const loadData = function(data) {
  const allList = {};
  for (const todoId in data) {
    allList[todoId] = List.loadList(data[todoId]);
  }
  return allList;
};

const allList = loadData(data);

const writeList = function() {
  fs.writeFileSync(todoStore, JSON.stringify(allList));
};

const getExtension = function(path) {
  return path.match(/.*\.(.*)$/);
};

const checkForFile = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const givePath = function(url) {
  const homepage = `${STATIC_FOLDER}/html/homePage.html`;
  const staticPath = `${STATIC_FOLDER}${url}`;
  return url === '/' ? homepage : staticPath;
};

const serveStaticPage = (req, res, next) => {
  const path = givePath(req.url);

  if (checkForFile(path)) {
    return next();
  }

  const [, extension] = getExtension(path);
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  send(res, contentType, content);
};

const createANewTodo = function(req, res) {
  const date = new Date();
  const id = date.getTime();
  const list = new List(req.body.title, date, id);
  allList[id] = list;
  writeList();
  sendTodoStatus(res, list);
};

const updateTitle = function(req, res) {
  const list = allList[req.body.id];
  list.updateTitle(req.body.title);
  sendTodoStatus(res, list);
};

const addItemToTodo = function(req, res) {
  const list = allList[req.body.id];
  list.addItem(req.body.item);
  sendItem(req, res, list);
};

const updateItem = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allList[todoId];
  list.updateItem(req.body);
  sendItem(req, res, list);
};

const serveCardDetails = function(req, res) {
  sendTodoStatus(res, allList[req.body.id]);
};

const deleteAItemOfTodo = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allList[todoId];
  list.removeItem(req.body.id);
  writeList();
  sendStatus(res, { id: req.body.id });
};

const deleteTodos = function(req, res) {
  const todos = req.body;
  todos.forEach(id => {
    delete allList[id];
  });
  writeList();
  sendStatus(res, todos);
};

const updateItemStatus = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allList[todoId];
  list.updateItemStatus(req.body);
  writeList();
  res.statusCode = 200;
  res.end();
};

const sendItem = function(req, res, list) {
  writeList();
  const item = list.getItem(req.body.item);
  const data = { id: list.id, item };
  sendStatus(res, data);
};

const serveStatus = function(req, res) {
  sendStatus(res, allList);
};

const sendTodoStatus = function(res, list) {
  const data = list.getStatus;
  sendStatus(res, data);
};

const sendStatus = function(res, data) {
  const content = JSON.stringify(data);
  send(res, 'application/json', content);
};

const send = function(res, type, content) {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    const contentType = req.headers['content-type'];
    if (contentType === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(req.body);
    }
    if (contentType === 'application/json') {
      req.body = JSON.parse(req.body);
    }
    next();
  });
};

const app = new App();

app.use(readBody);
app.get(serveStatus, '/status');
app.post(createANewTodo, '/title');
app.post(updateTitle, '/updateTitle');
app.post(addItemToTodo, '/addItem');
app.post(updateItem, '/updateItem');
app.post(serveCardDetails, '/cardDetails');
app.post(deleteAItemOfTodo, '/deleteItem');
app.post(deleteTodos, '/deleteTodos');
app.post(updateItemStatus, '/itemTickStatus');
app.get(serveStaticPage);

module.exports = app;

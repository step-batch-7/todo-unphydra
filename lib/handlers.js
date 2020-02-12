const fs = require('fs');
const App = require('./app');
const List = require('./list');
const CONTENT_TYPES = require('./mimeTypes');
const config = require('./config');

const todoStore = `${config.DATA_STORE}/database.json`;
const userStore = `${config.DATA_STORE}/user.json`;
const STATIC_FOLDER = `${__dirname}/../public`;

const data = JSON.parse(fs.readFileSync(todoStore, 'utf8'));
const user = JSON.parse(fs.readFileSync(userStore, 'utf8'));

const loadData = function(data) {
  const allData = {};
  for (const user in data) {
    const allList = {};
    for (const todoId in data[user]) {
      allList[todoId] = List.loadList(data[user][todoId]);
    }
    allData[user] = allList;
  }
  return allData;
};

const allData = loadData(data);

const writeList = function() {
  fs.writeFileSync(todoStore, JSON.stringify(allData));
  fs.writeFileSync(userStore, JSON.stringify(user));
};

const getExtension = function(path) {
  return path.match(/.*\.(.*)$/);
};

const checkForFile = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const givePath = function(url) {
  const homepage = `${STATIC_FOLDER}/html/login.html`;
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

const loginAUser = function(req, res) {
  res.statusCode = 200;
  res.end();
};

const registerAUser = function(req, res) {
  const { username, password } = req.body;
  const cookie = `coco=${new Date().getTime()}`;
  user[username] = { password, cookie };
  allData[username] = {};
  res.setHeader('Set-Cookie', cookie);
  writeList();
  res.statusCode = 200;
  res.end();
};

const findUser = function(cookie) {
  let username;
  for (const un in user) {
    if (user[un].cookie === cookie) {
      username = un;
    }
  }
  return username;
};

const createANewTodo = function(req, res) {
  const date = new Date();
  const id = date.getTime();
  const list = new List(req.body.title, id);
  allData[req.username][id] = list;
  writeList();
  sendTodoStatus(res, list);
};

const updateTitle = function(req, res) {
  const list = allData[req.username][req.body.id];
  list.updateTitle(req.body.title);
  writeList();
  sendTodoStatus(res, list);
};

const addItemToTodo = function(req, res) {
  const list = allData[req.username][req.body.id];
  list.addItem(req.body.item);
  sendItem(req, res, list);
};

const updateItem = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allData[req.username][todoId];
  list.updateItem(req.body);
  sendItem(req, res, list);
};

const serveCardDetails = function(req, res) {
  sendTodoStatus(res, allData[req.username][req.body.id]);
};

const deleteAItemOfTodo = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allData[req.username][todoId];
  list.removeItem(req.body.id);
  writeList();
  sendStatus(res, { id: req.body.id });
};

const deleteTodos = function(req, res) {
  const todos = req.body;
  todos.forEach(id => {
    delete allData[req.username][id];
  });
  writeList();
  sendStatus(res, todos);
};

const updateItemStatus = function(req, res) {
  const [todoId] = req.body.id.split(':');
  const list = allData[req.username][todoId];
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
  const cookie = req.headers.cookie;
  const username = findUser(cookie);
  sendStatus(res, allData[username]);
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
    if (contentType === 'application/json') {
      req.body = JSON.parse(req.body);
    }
    next();
  });
};

const cookieParser = function(req, res, next) {
  const cookie = req.headers['cookie'];
  if (cookie) {
    req.username = findUser(cookie);
  }
  next();
};

const checkUser = function(req, res, next) {
  const validUrls = [
    '/',
    '/css/homePage.css',
    '/css/login.css',
    '/js/loginTemplates.js',
    '/js/login.js',
    '/js/sendRequest.js',
    '/js/login.js',
    '/signup'
  ];
  if (req.username || validUrls.includes(req.url)) {
    return next();
  }
  req.reqType = 'bad';
};

const checkAccess = function(req, res, next) {
  if (req.reqType !== 'bad') {
    return next();
  }
  res.statusCode = 400;
  res.end();
};

const notFound = function(req, res) {
  res.statusCode = 404;
  res.end('opps!');
};

const app = new App();

app.use(readBody);
app.use(cookieParser);
app.use(checkUser);
app.use(checkAccess);
app.get(serveStatus, '/status');
app.post(createANewTodo, '/title');
app.post(updateTitle, '/updateTitle');
app.post(addItemToTodo, '/addItem');
app.post(updateItem, '/updateItem');
app.post(serveCardDetails, '/cardDetails');
app.post(deleteAItemOfTodo, '/deleteItem');
app.post(deleteTodos, '/deleteTodos');
app.post(updateItemStatus, '/itemTickStatus');
app.post(loginAUser, '/login');
app.post(registerAUser, '/signup');
app.get(serveStaticPage);
app.use(notFound);

module.exports = app;

const List = require('./list');

const { writeFile } = require('./fileOperation');

const checkAuth = function(req, res, next) {
  const { username, password } = req.body;
  if (!(username in user)) {
    return sendStatus(res, { status: 'invalidUser' });
  }
  if (user[username].password !== password) {
    return sendStatus(res, { status: 'wrongPassword' });
  }
  next();
};

const checkUsernamePassword = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  if (!(username in data)) {
    return res.json({ status: 'invalidUsername' });
  }
  if (data[username].password !== password) {
    return res.json({ status: 'wrongPassword' });
  }
  next();
};

const loginAUser = function(req, res) {
  const data = req.app.locals.data;
  const { username } = req.body;
  const cookie = new Date().getTime();
  data[username].cookie = cookie;
  writeFile(req.app.locals.path, req.app.locals.data);
  res.cookie('coco', `${cookie}`);
  res.redirect('todo/homePage');
};

const registerAUser = function(req, res, next) {
  const data = req.app.locals.data;
  const { username, password } = req.body;
  data[username] = { username, password, todo: {} };
  writeFile(req.app.locals.path, req.app.locals.data);
  next();
};

const getUserDetails = function(req, res, next) {
  console.log(req.cookies);
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
    '/signup',
    '/login'
  ];
  if (req.username || validUrls.includes(req.url)) {
    return next();
  }
  req.reqType = 'bad';
  next();
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

// const app = new App();

// app.use(readBody);
// app.use(cookieParser);
// app.use(checkUser);
// app.use(checkAccess);
// app.get(serveStatus, '/status');
// app.post(createANewTodo, '/title');
// app.post(updateTitle, '/updateTitle');
// app.post(addItemToTodo, '/addItem');
// app.post(updateItem, '/updateItem');
// app.post(serveCardDetails, '/cardDetails');
// app.post(deleteAItemOfTodo, '/deleteItem');
// app.post(deleteTodos, '/deleteTodos');
// app.post(updateItemStatus, '/itemTickStatus');
// app.post(checkAuth, '/login');
// app.post(loginAUser, '/login');
// app.post(registerAUser, '/signup');
// app.get(serveStaticPage);
// app.use(notFound);

module.exports = {
  registerAUser,
  loginAUser,
  checkUsernamePassword,
  getUserDetails
};

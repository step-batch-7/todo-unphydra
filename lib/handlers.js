const fs = require('fs');
const querystring = require('querystring');
const App = require('./app');
const List = require('./list');
const CONTENT_TYPES = require('./mimeTypes');
// const allList = require('../database/database.json');
const allList = {};

const STATIC_FOLDER = `${__dirname}/../public`;

const writeList = function() {
  fs.writeFileSync('./database/database.json', JSON.stringify(allList));
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
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.end(content);
};

const createANewTodo = function(req, res) {
  const date = new Date();
  const id = date.getTime();
  const list = new List(req.body.title, date, id);
  allList[id] = list;
  // writeList();
  const data = list.getStatus;
  const content = JSON.stringify(data);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.end(content);
};

const addItemToTodo = function(req, res) {
  const list = allList[req.body.id];
  list.addItem(req.body.item);
  const data = list.getStatus;
  const content = JSON.stringify(data);
  res.setHeader('Content-Type', 'application/json');
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
app.post(createANewTodo, '/title');
app.post(addItemToTodo, '/addItem');
app.get(serveStaticPage);

module.exports = app;

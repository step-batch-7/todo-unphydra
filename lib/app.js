const express = require('express');
const cookieParser = require('cookie-parser');
const { loadData } = require('./fileOperation');
const config = require('./config');
const handlers = require('./handlers');
const userTodoRoute = require('./userTodoRoute');

const app = express();

app.locals.data = loadData(config['DATA_STORE']);
app.locals.path = config['DATA_STORE'];

app.use((req, res, next) => {
  console.log(`url:${req.url}  method:${req.method}`);
  return next();
});
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.post('/signup', handlers.registerAUser, handlers.loginAUser);
app.post('/login', handlers.checkUsernamePassword, handlers.loginAUser);
app.use('/todo', userTodoRoute);

module.exports = app;

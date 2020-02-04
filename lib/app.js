const { log } = require('console');

const areMethodAndPathEqual = function(route, req) {
  const areMethodsEqual = route.method === req.method;
  const arePathEqual = route.path === req.url;
  return areMethodsEqual && arePathEqual;
};

const findHandlers = function(routes, req) {
  const matchedRoutes = routes.filter(route => {
    if (!route.method || !route.path) {
      return true;
    }
    return areMethodAndPathEqual(route, req);
  });
  return matchedRoutes.map(route => route.handler);
};

class App {
  constructor() {
    this.routes = [];
  }
  get(handler, path) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(handler, path) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware });
  }
  serve(req, res) {
    log('Request: ', req.url, req.method);
    const matchingHandlers = findHandlers(this.routes, req);
    const next = function() {
      const handler = matchingHandlers.shift();
      handler && handler(req, res, next);
    };
    next();
  }
}

module.exports = App;

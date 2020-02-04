const http = require('http');
const { error, warn } = require('console');
const app = require('./lib/handlers');

const defaultPort = 4000;

const main = ([, , port = defaultPort]) => {
  const server = new http.Server(app.serve.bind(app));
  server.on('error', err => error('server error', err));
  server.on('listening', () =>
    warn('started listening', server.address())
  );
  server.listen(port);
};
main(process.argv);

const { log } = require('console');
const app = require('./lib/app');

const defaultPort = 4000;

const main = ([, , port = defaultPort]) => {
  app.listen(port, () => log(`started listening to ${port}`));
};
main(process.argv);

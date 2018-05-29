const config = require('config');

const database = config.get('database');
Object.keys(database).forEach((db) => {
  const path = `./${db}`;
  const dbModule = require(path);
  dbModule.init();
  module.exports[db] = dbModule;
});

const api = require('./server');
const config = require('config');
const database = require('./db');
global.database = database;

module.exports = api.start(config.get('api'));

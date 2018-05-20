const api = require('./server');
const config = require('config');

module.exports = api.start(config.get('api'));

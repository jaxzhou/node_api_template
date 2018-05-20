const fs = require('fs');
const path = require('path');
const Compose = require('koa-compose');

module.exports = function() {
  const basename = path.basename(__filename);
  const files = fs.readdirSync(__dirname);
  const stack = [];
  files.forEach(file => {
    if (file === basename) {
      return;
    }
    const filepath = path.join(__dirname, file);
    const component = require(filepath);
    stack.push(component);
  });
  return Compose(stack);
}


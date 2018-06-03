const fs = require('fs');
const path = require('path');


const basename = path.basename(__filename);
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file === basename) {
    return;
  }
  if (path.extname(file) != '.js') {
    return;
  }
  const filepath = path.join(__dirname, file);
  const serviceModule = require(filepath);
  const serviceName = path.basename(file, path.extname(file));
  const serviceNameComponents = serviceName.toLowerCase().split('service');
  const captialComponents = serviceNameComponents.map(n => n.charAt(0).toUpperCase() + n.slice(1));
  captialComponents.push('Service');
  const captialServiceName = captialComponents.join('');
  console.info(`load service ${captialServiceName}`);
  module.exports[captialServiceName] = serviceModule;
});


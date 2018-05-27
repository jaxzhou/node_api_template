const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const Compose = require('koa-compose');

class Controllers {

  constructor() {
    this.router = new Router();
  }

  middlewares() {
    const basename = path.basename(__filename);
    const files = fs.readdirSync(__dirname);
    files.forEach(file => {
      if (file === basename) {
        return;
      }
      const filepath = path.join(__dirname, file);
      const controllerClass = require(filepath);
      const controller = new controllerClass();
      const rootPath = controller.path || '/';
      const routes = controller.routes;
      if (routes) {
        Object.keys(routes).forEach(subpath => {
          const fullPath = path.join(rootPath, subpath);
          const route = routes[subpath];
          Object.keys(route).forEach(method => {
            const funcName = route[method];
            const module = controller[funcName];
            this.router[method](fullPath, module.bind(controller));
          });
        });
      }
    });
    return Compose([this.router.routes(), this.router.allowedMethods()])
  }
}

module.exports = Controllers;
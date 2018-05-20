# node-api-template

## App

- nodejs version:8+ (https://nodejs.org/)
- Koa (https://koajs.com/)
- Koa-Router (https://github.com/alexmingoia/koa-router)
- Babel

```
npm install
npm start
```

## Middlewares

Add Middelware Code in ```./src/middlewares``` and exports aysnc function (ctx, next)

sample:
```javascript
module.exports = aysnc function(ctx, next) {
	console.info('let start at beginning');
	await next();
	console.info('let start at end');
}
```

## Controllers

1. Add Controller Code in ```./src/controllers``` and export Controller Class

```javascript
\\ MyController.js
class MyController {

}
module.exports = MyController
```

2. Add Route Annotation to Controller function

```
const Controller = require('./index');
const route = Controller.route;
const auth = Controller.auth;

class MyController {
	@route('GET', '/something')
	async doSomthing(ctx, next) {
		ctx.body = 'do something';
	}

	@route('GET', '/somethingNeedAuth')
	@auth()
	async doSomthingNeedAuth(ctx, next) {
		ctx.body = 'do something need auth';
	}
}

```

## Run With PM2

```
pm2 start api.config.js
```
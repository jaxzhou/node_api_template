const jwt = require('jsonwebtoken');
const config = require('config');

const algorithm = {
  jwt: async (authString) => {
    const options = config.get('jwt');
    const {secret} = options;
    const json = await new Promise((resolve, reject) => {
      jwt.verify(authString, secret, options, (err, decodeDoc) => {
        err ? reject(err) : resolve(decodeDoc);
      });
    });
    return json;
  }
};

const authMiddleware = async function(ctx, next) {
  const request = ctx.request;
  const authorization = request.get("Authorization");
  if (authorization) {
    const [authMethod, authString] = authorization.split(' ');
    if (authMethod && authString) {
      if (algorithm[authMethod]) {
        try {
          const authInfo = await algorithm[authMethod](authString);
          ctx.auth = authInfo;
        } catch (e) {
          ctx.auth = null;
        }
      }
    }
  }
  await next();
};

module.exports = authMiddleware;
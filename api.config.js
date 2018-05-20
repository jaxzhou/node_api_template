
module.exports = {
  apps : [
    {
      name       : 'api server',
      script     : 'src/index.js',
      interpreter: 'babel-node',
      watch      : ['./src', './config']
    }
  ]
};
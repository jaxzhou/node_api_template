import mongoose from 'mongoose'; 
import config from 'config';

class Models {
  constructor() {
    const mongodbConfig = config.has('Mongod') ? config.get('Mongod') : {host: 'localhost', port: 27017};
    let mongodbURL = `mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongodbURL, {useMongoClient: true});
  }

  getModel(modelName) {
    let model = mongoose.models[modelName];
    if (!model) {
      const db = mongoose.connection;
      const schema = require(`./schemas/${modelName.toLowerCase()}`).default;
      if (schema) {
        model = mongoose.model(modelName, schema);
      }
    }
    return model
  }
}

export default Models;

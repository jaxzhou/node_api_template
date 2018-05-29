const _ = require('lodash');
const config = require('config');
const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const util = require('util');

const pgConfig = config.get('database.pg');

class PgWrapper {

  constructor(config) {
    this.config = config;
  }

  async init() {
    const pgConfig = config.get('database.pg');
    const pgpool = new Pool(pgConfig);
    try {
      const conn = await pgpool.connect();
      await conn.release();
    } catch(e) {
      const dbnotexit = /database \"(.*)\" does not exist/i;
      if (dbnotexit.test(e.message)) {
        const rootConfig = _.clone(pgConfig);
        const database = rootConfig.database;
        delete rootConfig.database;
        const client = new Client(rootConfig);
        await client.connect();
        logger.debug('create database');
        await client.query(`CREATE DATABASE ${database};`);
        await client.end();
      } else {
        throw e;
      }
    }
    this.pool = pgpool;
    await this.upgrade();
    return this;
  }

  async upgrade() {
    const version = {};
    try {
      const result = await this.query('SELECT * FROM data_version;');
      if (result.rowCount) {
        const current = result.rows[0];
        version.version = current.version;
        version.patch = current.patch;
      }
    } catch(e) {
      version.version = -1;
      version.patch = 0;
    }
    console.info(`current data version: ${version.version} patch: ${version.patch}`);
    if (version.version < 0) {
      const initScript = require('./pg/init');
      await initScript.up(this);
    }
    const patchFolder = path.join(__dirname, `./pg/v${version.version}`);
    const files = fs.readdirSync(patchFolder);
    for (const file of files) {
      const basename = path.basename(file);
      const [patch, ext] = basename.split('.');
      if (ext === 'js' && parseInt(patch) > version.patch) {
        const upgrader = require(path.join(patchFolder, file));
        await upgrader.up(this);
      }
    }
  }

  async getClient() {
    if (!this.pool) {
      throw new Error('database not initialized');
    }
    if (!this.client) {
      this.client = await this.pool.connect();
    }
    return this.client;
  }

  async transactions(actions) {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      for (const action of actions) {
        await client.query.apply(this.client, action);
      }
      await client.query('COMMIT');
    } catch(e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      this.release()
    }
  }

  async query(query) {
    const client = await this.getClient();
    try {
      return await client.query(query);
    } finally {
      this.release()
    }
  }

  release() {
    this.client.release();
    this.client = null;
  }
}


module.exports = new PgWrapper(pgConfig);

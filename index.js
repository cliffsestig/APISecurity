'use strict';
const mongoose = require( 'mongoose' );
const util = require( 'util' );
var fs = require('file-system');
var https = require('https');

// config should be imported before importing any other file
const config = require( './lib/utils/config' );
const app = require( './lib/utils/express' );

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// plugin bluebird promise in mongoose
mongoose.Promise = global.Promise;

var options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.crt' ),
    requestCert: false,
    rejectUnauthorized: false
};

// connect to mongo db
const mongoUri = config.mongoUri;
mongoose.connect(mongoUri, {
  useMongoClient: true
});
mongoose.connection
  .once('open', () => {
    console.log(`Connected to Mongo on  ${mongoUri}`);
  })
  .on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
  });

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {
//   // listen on port config.port
//   app.listen(config.port, options, () => {
//     console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
//   });
// }

module.exports = app;

https.createServer(options, app).listen(443);
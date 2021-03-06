'use strict';
const express = require( 'express' );
const logger = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const compress = require( 'compression' );
const methodOverride = require( 'method-override' );
const cors = require( 'cors' );
const httpStatus = require( 'http-status' );
const expressValidation = require( 'express-validation' );
const routes = require( '../api/routes/index.route' );
const config = require( './config' );
const APIError = require( './helpers/APIError' );
var RateLimit = require('express-rate-limit');
const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({origin: 'https://localhost:4200'}));


// mount all routes on /api path

var apiLimiter = new RateLimit({
  windowMs: 5*60*1000, // 15 minutes
  max: 5,
  delayAfter: 2, // begin slowing down responses after the second request
  delayMs: 2*1000, // slow down subsequent responses by 3 seconds per request
  message: "You did to many requests try again in 15 minutes"
});
app.use('/api/auth/login', apiLimiter);

app.use('/api', routes);
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

module.exports = app;

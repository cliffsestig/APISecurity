const jwt = require( 'jsonwebtoken' );
const httpStatus = require( 'http-status' );
const APIError = require( '../../utils/helpers/APIError' );
const config = require( '../../utils/config' );
const User = require( '../../models' ).User;
var request = require('request');


// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
var options = {
    url: 'https://www.google.com/recaptcha/api/siteverify',
    method: 'POST',
    headers: headers,
    form: {}
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({ email: req.body.email })
    .then((userFound) => {
      if (req.body.email === userFound.email && userFound.comparePassword(req.body.password) ) {
        const token = jwt.sign({
          userId: userFound._id,
          admin: userFound.admin
        }, config.jwtSecret);
        return res.json({
          token
        });
      }
      else {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}

function captcha(req, res, next) {
  options.form = {"secret": "6Lf8oUkUAAAAAPh8WSnX9kVHfpaVDpcEiillYTAm", "response": req.body.event};
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        if (JSON.parse(body).success) {
          return res.json(JSON.parse(body));
        }
    }
  });
  
}

module.exports = { login, captcha };

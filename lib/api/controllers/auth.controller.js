const jwt = require( 'jsonwebtoken' );
const httpStatus = require( 'http-status' );
const APIError = require( '../../utils/helpers/APIError' );
const config = require( '../../utils/config' );
const User = require( '../../models' ).User;
var request = require('request');
var randomstring = require("randomstring");
const mailgun = require( '../../utils/mailgun' );
const pug = require('pug');
const EMAIL_TEMPLATES_ROOT = __dirname + '/../../../email-templates/';

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

function forgot(req, res, next) {
   User.findOne({ email: req.body.email })
    .then((userFound) => {
      if (req.body.email === userFound.email) {
        var rnd = randomstring.generate();
        userFound.resetPasswordToken = rnd;
        userFound.resetPasswordExpires = Date.now() + 3600000;
        userFound.save();
          var data = {
          from: config.fromEmail,
          to: "csestig@avans.nl",
          subject: 'Wachtwoord reset',
          html: pug.renderFile( EMAIL_TEMPLATES_ROOT + 'forgot-password.pug', { "url": "https://localhost:4200/user/reset/" + rnd } )
        };

        mailgun.messages().send(data, function (error, body) {
          if ( error ) {
            console.error(error);
            return false;
          }
          else {
            console.log('mail has been send');
            console.log(body);
            return true;
          }
      })
      }
      else {
        const err = new APIError('Email not found', httpStatus.NOTFOUND, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}

function reset(req, res, next){
  User.findOne({ resetPasswordToken: req.body.passwordReset })
    .then((userFound) => {
      console.log(userFound.resetPasswordExpires);
      console.log(Date.now());
      console.log(userFound.resetPasswordExpires >= Date.now());
      if (userFound.resetPasswordExpires >= Date.now()) {
        console.log('hpi');
        userFound.setPassword( req.body.password );
        userFound.save();
      }
    });
}
module.exports = { login, captcha, forgot, reset };

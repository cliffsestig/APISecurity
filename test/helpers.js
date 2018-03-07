const config = require('../lib/utils/config');

const jwt = require('jsonwebtoken');

function checkErr(err) {
  if (err !== null) {
    throw err;
  }
}

function getToken(userId, admin) {
  return jwt.sign({
    userId: userId,
    admin: admin
  }, config.jwtSecret);
}

function setAuth(ctx, userId, admin) {
  const token = getToken(userId, admin);
  return ctx.set('Authorization', 'Bearer ' + token);
}

module.exports = {
  checkErr: checkErr,
  getToken: getToken,
  setAuth: setAuth,

  // Templates
  userTemplate: {
    email: 'john@caps.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'CAPS'
  }
};
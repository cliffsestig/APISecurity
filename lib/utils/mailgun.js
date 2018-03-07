const Mailgun = require( 'mailgun-js' );
const config = require( './config' );
const api_key = config.mailgunKey;
const sendingDomain = config.sendingDomain;

const mailgun = new Mailgun({apiKey: api_key, domain: sendingDomain});

module.exports = mailgun;

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongooseDebug: process.env.MONGOOSE_DEBUG || true,
  jwtSecret: process.env.JWT_SECRET || '',
  mongoUri: process.env.MONGO_URI || '',
  mollieKey: process.env.MOLLIE_KEY || '',
  mollieWebhookUrl: process.env.MOLLIE_WEBHOOK_URL,
  mailgunKey: process.env.MAILGUN_KEY || '',
  sendingDomain: process.env.SENDING_DOMAIN || 'caps-dev.devments.com',
  fromEmail: process.env.FROM_EMAIL || 'info@devments.com'
};

module.exports = config;

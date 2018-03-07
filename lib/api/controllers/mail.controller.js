'use strict';
const config = require( '../../utils/config' );
const mailgun = require( '../../utils/mailgun' );
const pug = require('pug');
const EMAIL_TEMPLATES_ROOT = __dirname + '/../../../email-templates/';

/**
 * Send mail for account confirmation
 */
function accountConfirmation(userObject) {
  var data = {
    from: config.fromEmail,
    to: 'jensderond@gmail.com',
    subject: 'Account bevestiging',
    html: pug.renderFile( EMAIL_TEMPLATES_ROOT + 'account-confirm.pug', { name: userObject.firstName, email: userObject.email } )
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
  });
}

/**
 * Send mail for order confirmation
 */
function orderConfirmation(orderObject) {
  var entries;

  console.log(entries);
  var data = {
    from: config.fromEmail,
    to: 'jensderond@gmail.com',
    subject: 'Bestelling bevestiging',
    html: pug.renderFile( EMAIL_TEMPLATES_ROOT + 'order-confirm.pug',
    {
      orderId: orderObject.id,
      name: orderObject.customer.firstName,
    })
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
  });
}

/**
 * Send mail for order confirmation
 */
function paymentConfirmation(paymentObject) {

  var data = {
    from: config.fromEmail,
    to: 'jensderond@gmail.com',
    subject: 'Betaal status is gewijzigd',
    html: pug.renderFile( EMAIL_TEMPLATES_ROOT + 'payment-confirm.pug',
    {
      orderId: paymentObject.id,
      name: paymentObject.customer.firstName
    })
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
  });
}

module.exports = { accountConfirmation, orderConfirmation, paymentConfirmation };

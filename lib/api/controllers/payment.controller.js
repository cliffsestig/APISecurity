'use strict';
const mollie = require( '../../utils/mollie' );
const Order = require('../../models').Order;
const config = require( '../../utils/config' );
const httpStatus = require( 'http-status' );
const APIError = require( '../../utils/helpers/APIError' );
const mailCtrl = require('../controllers/mail.controller');

/**
* Create a new payment URL
* @property {number} req.body.amount - The amount of the payment.
* @property {string} req.body.description - The description of the payment.
* @property {string} req.body.redirectUrl - The redirect url of the payment.
* @property {string} req.body.webhookUrl - The webhook url of the payment.
* @returns {Product}
*/
function create(req, res, next) {
  Order.findById(req.body.orderId)
    .then((order) => {
      mollie.payments.create({
        amount:      order.totalPrice,
        description: 'CAPS Order '+ order.id,
        redirectUrl: req.body.redirectUrl,
        webhookUrl:  config.mollieWebhookUrl
      }, function (payment) {
        order.paymentId = payment.id;
        order.save()
          .then(() => res.status(httpStatus.CREATED).json({ url: payment.getPaymentUrl() }))
          .catch(e => next(e));
      });
    })
    .catch();
}

function webhook (req, res, next) {
  if ( req.body.id ) {
    Order.findOne( { paymentId: req.body.id } )
      .then( (order) => {
        if (order === null) {
          throw new Error('invalid paymentId');
        }
        return new Promise((resolve, reject) => {
          mollie.payments.get(req.body.id, (payment) => {

            if (payment.error) {
              reject(payment.error);
              return;
            }
            if (payment.isPaid()) {
              order.status = 'paid';
              mailCtrl.paymentConfirmation(order)
            }
            else if (!payment.isOpen()) {
              order.status = 'failed';
              mailCtrl.paymentConfirmation(order)
            }

            resolve(order);
          });
        });
      })
      .then( (order) => {
        return order.save();
      })
      .then( () => {
        res.status( httpStatus.OK ).end();
      })
      .catch((e) => {
        if (config.env == 'development') {
          console.error(e);
        }

        // Return OK, otherwise Mollie will retry this action.
        res.status( httpStatus.OK ).end();
      });
  }
}

/**
* Update a payment when webhook is called
* @property {number} req.body.amount - The amount of the payment.
* @property {string} req.body.description - The description of the payment.
* @property {string} req.body.redirectUrl - The redirect url of the payment.
* @property {string} req.body.webhookUrl - The webhook url of the payment.
* @returns {Product}
*/
function update(req, res, next) {
  //TODO: UPDATE ORDER TO CHANGE PAYMENT STATUS
  res.json({ updated: true });
}

module.exports = { create, update, webhook };

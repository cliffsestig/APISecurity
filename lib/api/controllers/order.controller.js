'use strict';
const Order = require('../../models').Order;
const User = require('../../models').User;
const httpStatus = require( 'http-status' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../utils/config' );
const productCtrl = require('../controllers/product.controller');
const mailCtrl = require('../controllers/mail.controller');

/**
 * Load order by id and append to req.
 */
function load(req, res, next, id) {
  Order.findById(id).populate('entries.product')
    .then((order) => {
      req.order = order;
      return next();
    })
    .catch(e => next(e));
}

/**
* Get order
* @returns {Order}
*/
function get(req, res) {
  if ( req.order === null ) {
    return res.status( httpStatus.NOT_FOUND ).json();
  }
  else {
    return res.status( httpStatus.OK ).json( req.order );
  }
}

/**
 * Get all orders
 * @returns {Order}
 */
function getAll(req, res) {
  var userId = jwt.decode( req.headers.authorization.split(' ')[1], config.jwtSecret).userId;
  var admin = jwt.decode( req.headers.authorization.split(' ')[1], config.jwtSecret).admin;
  if ( admin ) {
    Order.find({ }).populate('entries.product')
      .then( (results) => res.status( httpStatus.OK ).json( results ) )
      .catch( (error) => res.status( httpStatus.BAD_GATEWAY ).json( error ) );
  }
  else {
    Order.find({ 'customer.user': userId }).populate('entries.product')
      .then( (results) => res.status( httpStatus.OK ).json( results ) )
      .catch( (error) => res.status( httpStatus.BAD_GATEWAY ).json( error ) );
  }
}

/**
* Create new order
* @property {string} req.body.name - The name of order.
* @property {string} req.body.category - The category of order.
* @property {string} req.body.gender - The gender of order.
* @property {string} req.body.price - The price of order.
* @property {string} req.body.orderVariants - The variants of a order.
* @returns {Order}
*/
function create(req, res, next) {
  var userId;
  if (req.headers.authorization !== undefined) {
    userId = jwt.decode(req.headers.authorization.split(' ')[1], config.jwtSecret).userId;
  }
  productCtrl.calculateOrderPrice(req.body.entries)
    .then( (calculatedPrice) => {
      return {
        entries: req.body.entries,
        totalPrice: calculatedPrice,
        paymentId: '',
        status: 'open'
      };
    })
    .then( (orderTemplate) => {
      if (userId !== undefined) {
        return User.findById(userId)
          .then( (user) => {
            orderTemplate.customer = {
              user: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address,
              city: user.city,
              province: user.province,
              postalCode: user.postalCode,
              country: user.country
            };
            return orderTemplate;
          });
      } else {
        orderTemplate.customer = req.body.customer;
        orderTemplate.customer.user = null;
        return orderTemplate;
      }
    })
    .then( (orderTemplate) => {
      return new Order(orderTemplate).save();
    })
    .then( (order) => {
      mailCtrl.orderConfirmation(order);
      res.json(order);
    })
    .catch(e => next(e));
}

module.exports = { load, get, getAll, create };

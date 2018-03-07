const express = require('express');
const paymentCtrl = require('../controllers/payment.controller');
const expressJwt = require( 'express-jwt' );
const config = require( '../../utils/config' );

const router = express.Router();

router.route('/')
/** POST /api/payment - Create new product */
  .post( paymentCtrl.create );


router.route('/webhook')
  .post( paymentCtrl.webhook );

  module.exports = router;

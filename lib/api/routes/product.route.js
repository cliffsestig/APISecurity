const express = require('express');
const expressJwt = require( 'express-jwt' );
const config = require( '../../utils/config' );
const productCtrl = require('../controllers/product.controller');

const router = express.Router();

router.route('/')
/** GET /api/product - Get all product */
  .get(productCtrl.getAll)

/** POST /api/product - Create new product */
  .post(expressJwt({ secret: config.jwtSecret }), productCtrl.create);

router.route('/:productId')
/** GET /api/product/:productId - Get product */
  .get(productCtrl.get)

/** PUT /api/product/:productId - Update product */
  .put(expressJwt({ secret: config.jwtSecret }), productCtrl.update)

/** DELETE /api/product/:productId - Delete product */
  .delete(expressJwt({ secret: config.jwtSecret }), productCtrl.remove);

/** Load product when API with productId route parameter is hit */
router.param('productId', productCtrl.load);

module.exports = router;

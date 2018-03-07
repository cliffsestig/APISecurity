const express = require( 'express' );
const expressJwt = require( 'express-jwt' );
const config = require( '../../utils/config' );
const orderCtrl = require( '../controllers/order.controller' );

const router = express.Router();

router.route('/')
/** GET /api/order - Get all orders */
  .get(expressJwt({ secret: config.jwtSecret }), orderCtrl.getAll)

/** POST /api/order - Create new order */
  .post( orderCtrl.create );

router.route('/:orderId')
/** GET /api/order/:orderId - Get order */
  .get(orderCtrl.get);

/** PUT /api/order/:orderId - Update order */
//  .put(expressJwt({ secret: config.jwtSecret }), orderCtrl.update)

/** DELETE /api/order/:orderId - Delete order */
//  .delete(expressJwt({ secret: config.jwtSecret }), orderCtrl.remove);


/** Load order when API with orderId route parameter is hit */
router.param('orderId', orderCtrl.load);

module.exports = router;

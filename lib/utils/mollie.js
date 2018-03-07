const Mollie = require( 'mollie-api-node' );
const config = require( './config' );

mollie = new Mollie.API.Client;
mollie.setApiKey( config.mollieKey );

module.exports = mollie;

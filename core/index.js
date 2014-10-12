// # Ether bootloader
// Orchestrates the loading of Ether
// When run from command line.

var server = require('./server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

function makeEther(options) {
    options = options || {};

    return server(options);
}

module.exports = makeEther;

/*=============================================================================

  Ether/core/server/index.js

=============================================================================*/

// Module dependencies
var crypto     = require('crypto'),
    express    = require('express'),
    hbs        = require('express-hbs'),
    compress   = require('compression'),
    fs         = require('fs'),
    uuid       = require('node-uuid'),
    _          = require('lodash'),
    Promise    = require('bluebird'),
    
    errors     = require('./errors'),
    config     = require('./config');



var packageInfo = require('../../package.json');
var EtherServer = require('./ether-server');


function init(options) {
  // Get reference to an express app instance.
    var webApp = express(),
        adminApp = express(),
        // create a hash for cache busting assets
        assetHash = (crypto.createHash('md5').update(packageInfo.version + Date.now()).digest('hex')).substring(0, 10);


    // ## View engine
    // set the view engine
    webApp.set('view engine', 'hbs');

    // Create a hbs instance for admin and init view engine
    adminApp.set('view engine', 'hbs');
    //adminApp.engine('hbs', adminHbs.express3({}));
    
    // Load our config.js file from the local file system.
    return config.load(options.config).then(function () {
        return new EtherServer(webApp);
    });

    

}

module.exports = init;

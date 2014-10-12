// # Ether bootloader
// Orchestrates the loading of Ether
// When run from command line.

var express,
    ether,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
//require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ether = require('./core');
//errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

ether().then(function (etherServer) {
    // Mount our ether instance on our desired subdirectory path if it exists.
    //parentApp.use(etherServer.config.paths.subdir, etherServer.rootApp);

    // Let ether handle starting our server instance.
    etherServer.start(parentApp);
}).catch(function (err) {
    //errors.logErrorAndExit(err, err.context, err.help);
    console.error(err);
});

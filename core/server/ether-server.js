/*=============================================================================

  Ether/core/server/ether-server.js

=============================================================================*/

var colors      = require('colors'),
    Promise     = require('bluebird'),
    fs          = require('fs'),
    semver      = require('semver'),

    packageInfo = require('../../package.json'),

    errors      = require('./errors'),
    config      = require('./config');





function EtherServer(rootApp) {
    this.rootApp        = rootApp;
    this.httpServer     = null;
    this.connections    = [];
    //this.upgradeWarning = setTimeout(this.logUpgradeWarning.bind(this), 5000);

    // Expose config module for use externally.
    this.config = config;

    console.log('> EtherServer::constructor');
}

EtherServer.prototype.connection = function (socket) {
    this.connections.push(socket);
};

// Most browsers keep a persistant connection open to the server
// which prevents the close callback of httpServer from returning
// We need to destroy all connections manually
EtherServer.prototype.closeConnections = function () {
    this.connections.forEach(function (socket) {
        socket.destroy();
    });
};

EtherServer.prototype.logStartMessages = function () {
    // Startup & Shutdown messages
    if (process.env.NODE_ENV === 'production') {
        [
            'Ether is running...'.green,
            ('Your web is now available on ' + config.url),
            'Ctrl+C to shut down'.grey
        ].forEach(function(item) {
            console.log(item);
        });

        // ensure that Ghost exits correctly on Ctrl+C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
            console.log(
                '\nEther has shut down'.red,
                '\nYour web is now offline'
            );
            process.exit(0);
        });
    } else {
        [
            ('Ether is running in ' + process.env.NODE_ENV + '...').green,
            ('Listening on ' + 
                (config.getSocket() || config.server.host + ':' + config.server.port)
            ),
            ('Url configured as : ' + config.url),
            'Ctrl+C to shut down'.grey
        ].forEach(function(item) {
            console.log(item);
        });
        // ensure that Ghost exits correctly on Ctrl+C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
            console.log(
                '\nEther has shutdown'.red,
                '\nEther was running for',
                Math.round(process.uptime()),
                'seconds'
            );
            process.exit(0);
        });
    }
};


EtherServer.prototype.logShutdownMessages = function () {
    console.log('Ether is closing connections'.red);
};

/**
 * Starts the ether server listening on the configured port.
 * Alternatively you can pass in your own express instance and let Ghost
 * start lisetning for you.
 * @param  {Object=} externalApp Optional express app instance.
 * @return {Promise}
 */
EtherServer.prototype.start = function (externalApp) {
    var self = this,
        rootApp = externalApp ? externalApp : self.rootApp;

    console.log('> EtherServer.prototype.start');
    
    // ## Start Ether App
    return new Promise(function (resolve) {
        /*if (config.getSocket()) {
            // Make sure the socket is gone before trying to create another
            try {
                fs.unlinkSync(config.getSocket());
            } catch (e) {
                // We can ignore this.
            }

            self.httpServer = rootApp.listen(
                config.getSocket()
            );

            fs.chmod(config.getSocket(), '0660');
        } else {
            self.httpServer = rootApp.listen(
                config.server.port,
                config.server.host
            );
        }*/

        rootApp.get('/', function(req, res){
            res.send('Hello Happy Katz!');
        });


        self.httpServer = rootApp.listen(
            config.server.port,
            config.server.host
        );


        self.httpServer.on('error', function (error) {
            if (error.errno === 'EADDRINUSE') {
                /*errors.logError(
                    '(EADDRINUSE) Cannot start Ghost.',
                    'Port ' + config.server.port + ' is already in use by another program.',
                    'Is another Ghost instance already running?'
                );*/
                console.log(
                    ['(EADDRINUSE) Cannot start Ether.',
                    'Port ' + config.server.port + ' is already in use by another program.',
                    'Is another Ghost instance already running?'].join('')
                );
            } else {
                /*errors.logError(
                    '(Code: ' + error.errno + ')',
                    'There was an error starting your server.',
                    'Please use the error code above to search for a solution.'
                );*/
                console.log(
                    ['(Code: ' + error.errno + ')',
                    'There was an error starting your server.',
                    'Please use the error code above to search for a solution.'].join('')
                );
            }
            process.exit(-1);
        });
        self.httpServer.on('connection', self.connection.bind(self));
        self.httpServer.on('listening', function () {
            self.logStartMessages();
            //clearTimeout(self.upgradeWarning);
            resolve(self);
        });
    });
};

// Returns a promise that will be fulfilled when the server stops.
// If the server has not been started, the promise will be fulfilled
// immediately
EtherServer.prototype.stop = function () {
    var self = this;

    return new Promise(function (resolve) {
        if (self.httpServer === null) {
            resolve(self);
        } else {
            self.httpServer.close(function () {
                self.httpServer = null;
                self.logShutdownMessages();
                resolve(self);
            });

            self.closeConnections();
        }
    });
};

// Restarts the ghost application
EtherServer.prototype.restart = function () {
    return this.stop().then(this.start.bind(this));
};

// To be called after `stop`
EtherServer.prototype.hammertime = function () {
    console.log('Can\'t touch this'.green);

    return Promise.resolve(this);
};


module.exports = EtherServer;


/*
var express = require('express');
var app = express();


app.get('/', function(req, res){
  res.send('Hello Happy Katz!');
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
*/

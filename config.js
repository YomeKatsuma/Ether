/* based on Ghost-0.5.2 */
/*=============================================================================

    ether/config.js

    ether config.

=============================================================================*/


var path = require('path'),
    config;

config = {
    // ### Production
    // When running ether in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: 'http://my-ether-web.com',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ether.db')
            },
            debug: false
        },

        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '1272'
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your ether blogs published URL.
        url: 'http://localhost:1272',

        // Example mail config
        // Visit http://support.ether.org/mail for instructions
        // ```
        //  mail: {
        //      transport: 'SMTP',
        //      options: {
        //          service: 'Mailgun',
        //          auth: {
        //              user: '', // mailgun username
        //              pass: ''  // mailgun password
        //          }
        //      }
        //  },
        // ```

        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ether-dev.db')
            },
            debug: false
        },
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '1272'
        },
        paths: {
            contentPath: path.join(__dirname, '/content/')
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing ether to run tests and check the health of ether
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:1273',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ether-test.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '1273'
        },
        logging: false
    },

    // ### Testing MySQL
    // Used by Travis - Automated testing run through GitHub
    'testing-mysql': {
        url: 'http://127.0.0.1:1273',
        database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'root',
                password : '',
                database : 'ether_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '1273'
        },
        logging: false
    },

    // ### Testing pg
    // Used by Travis - Automated testing run through GitHub
    'testing-pg': {
        url: 'http://127.0.0.1:1273',
        database: {
            client: 'pg',
            connection: {
                host     : '127.0.0.1',
                user     : 'postgres',
                password : '',
                database : 'ether_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '1273'
        },
        logging: false
    }
};

// Export config
module.exports = config;

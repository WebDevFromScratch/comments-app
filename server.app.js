// babel for transforming the code to ES5
require('babel/register')({
  extensions: ['.js', '.jsx'],
  stage     : 0
});

// Middleware function of app bundle
var initter = require('./app/bundles/app/initters/server');

// Bundle settings
var config = require('./config/server.app');

// Starting Express server
require('./server')(initter, config);

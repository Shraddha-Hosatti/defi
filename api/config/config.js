'use strict';

const devConfig = require('./development.js');
const stagConfig = require('./staging.js');
const prodConfig = require('./production.js');
if (process.env["ENV"] == 'development') { module.exports = devConfig; }
else if (process.env["ENV"] == 'staging') { module.exports = stagConfig; }
else if (process.env["ENV"] == 'production') { module.exports = prodConfig; }
else module.exports = devConfig;

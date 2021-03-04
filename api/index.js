'use strict';

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan');
const config = require('./config/config.js')
const app = express()
const cors = require('cors')
const MyLogger = require("./tools/logging") // Init Logging
const routes = require('./routes/index');

// Server
const server = http.createServer(app)
app.use(cors())
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies

// Logging
if (config.env == "development") { app.use(logger('dev')) }
else if (config.env == "staging") { app.use(logger('dev')) }
else if (config.env == "production") { app.use(logger('combined')) }
console.log("------------------")
console.log("Enviornment ======> ", config.env, " <=======")

//HTTPS Handlers
app.use('/', routes);

// 404
app.get('*', function(req, res){
    res.status(404).send({});
});

// Start
server.listen(config.server.port, config.server.host, () => {
    console.log("------------------")
    console.log('listening on http://' + (config.server.host ) + ":" + (config.server.port ));
})

module.exports = app
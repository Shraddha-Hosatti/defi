'use strict';

const winston = require("winston")
const config = require("../config/config")


// Logger Config
var { splat, combine, timestamp, printf } = winston.format;
var myFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} | ${level} | ${message}`;
});

// Logger Class
function MyLogger(category, logPath) {
    this.category = category
    this.logPath = logPath
}

// Create Logger
MyLogger.prototype.CreateLogger = function () {

    if (config.logs.fileLogs){
        var finalLogPath = this.logPath + new Date().toISOString().split('T')[0]

        this.logger = winston.createLogger({
            level: 'info',
            format: combine(
                timestamp(),
                splat(),
                myFormat
            ),
            defaultMeta: "",
            transports: [
                new winston.transports.File({ filename: finalLogPath })
            ]
        });
    }

}

MyLogger.prototype.LogMessage = async function (msg) {

    // For console
    if (config.logs.consoleLogs){
        console.log(msg)
    }

    // File Logs
    if (config.logs.fileLogs){
        // Recreate Logger for Date Update
        this.CreateLogger()

        this.logger.info("==============================================================")
        this.logger.info(msg)
    }
}

MyLogger.prototype.LogErrorMessage = async function (error) {

    // For console
    if (config.logs.consoleLogs){
        console.error(error)
    }

    // File Logs
    if (config.logs.fileLogs){
        // Recreate Logger for Date Update
        this.CreateLogger()

        this.logger.error("==============================================================")
        this.logger.error(error)
    }
}

MyLogger.prototype.LogError = async function (error) {

    // For console
    if (config.logs.consoleLogs){
        console.error(error)
    }

    if (config.logs.fileLogs){
        // Recreate Logger for Date Update
        this.CreateLogger()

        this.logger.error("==============================================================")
        this.logger.error(error.stack.toString())

    }

}

MyLogger.prototype.logRequest = async function (req){

    // Recreate Logger for Date Update
    this.CreateLogger()

    // Create Data
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let type = req.method
    let api = req.originalUrl
    let params = req.body || req.query
    let headers = req.headers

    // Log
    let reqDoc = {
        ip: ip,
        type: type,
        api: api,
        body: params,
        headers: headers
    }

    // Log
    this.LogMessage("Request : " + JSON.stringify(reqDoc))

    return true

}

MyLogger.prototype.logResponse = async function (response){

    // Recreate Logger for Date Update
    this.CreateLogger()

    // Log
    this.LogMessage("Response : " + JSON.stringify(response))

}

// Global
var apiLogger = new MyLogger(config.logs.api.category, config.logs.api.path)

module.exports = {
    MyLogger,
    apiLogger
}
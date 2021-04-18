'use strict';

const config = require("../config/config")
const userException = require('./userException')
const userErrors = require("../constants/errors").userErrors
const apiLogger = require("./logging").apiLogger
const crypto = require("crypto")

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function successResponse(data, statusCode = 200) {

  let response = {}
  response['timestamp'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  response['statusCode'] = statusCode
  response['data'] = data
  return response

}

async function errorResponse(message, statusCode) {

  let response = {}
  response['timestamp'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  response['statusCode'] = statusCode
  response['message'] = message
  return response

}

async function handleErrorResponse(exception, res){

  // Reference
  let response
  let statusCode

  // Handle User Exception
  if(exception instanceof userException){
      statusCode = exception.statusCode
      response = await errorResponse(exception.message, exception.statusCode)
  }else{ // Internal Server Error
      statusCode = userErrors.oopsSomethingWentWrong.statusCode
      response = await errorResponse(userErrors.oopsSomethingWentWrong.message, userErrors.oopsSomethingWentWrong.statusCode)
  }

  // Log error
  apiLogger.LogError(exception)

  // Log Response
  apiLogger.logResponse(response, statusCode)

  // Send Response
  res.status(statusCode).send(response)

}

// async for each function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}

function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

module.exports = {
  handleErrorResponse,
  asyncForEach,
  errorResponse,
  successResponse,
  range,
  waitFor
}
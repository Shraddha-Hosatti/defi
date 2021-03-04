const userException = require('../tools/userException')

function ErrorMessage(message, statusCode, result=[]) {
    this.message = message
    this.statusCode = statusCode
    this.result = result
}

const validationError = function (array) {

    // Get Validation Errors
    let meta = {}
    meta['validationErrors'] = []
    for (let i in array) {
        meta['validationErrors'].push(array[i]['stack'])
    }

    // Console
    console.error(meta)

    // Create Exception
    let exception = {}
    exception.message = "Invalid Request Format"
    exception.statusCode = 400
    throw new userException(exception)
}

// User Errors
var userErrors = {}
userErrors.oopsSomethingWentWrong = new ErrorMessage("Oops! Something went wrong", 500)
userErrors.InvalidAddress = new ErrorMessage("Invalid Address", 400);

module.exports = {
    userErrors,
    ErrorMessage,
    validationError
}
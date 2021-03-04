'use strict';

// Class for User Expection
module.exports = function UserException(error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = error.message;
  this.statusCode = error.statusCode;
  this.result = error.result || [];
};

require('util').inherits(module.exports, Error);
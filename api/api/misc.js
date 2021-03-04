'use strict';

const util = require("../tools/util")
const apiLogger = require("../tools/logging").apiLogger
const refStrings = require("../constants/refStrings")

async function ping(req, res){

    try{

        // Log Request
        await apiLogger.logRequest(req)

        // Create Response
        let response = await util.successResponse({success:refStrings.success})

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

module.exports = {
    ping
}
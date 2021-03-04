'use strict';

const ethereumController = require("../controller/ethereum")
const util = require("../tools/util")

async function balance(req, res){

    try{

        // Reference
        let address
        let response

        // Get Data
        address = req.query.address

        // Get Balance
        response = await ethereumController.balance(address)

        // Create Response
        response = await util.successResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

module.exports = {
    balance
}
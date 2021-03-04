'use strict';

const ethereumUtil = require("../blockchain/util")

async function balance(address){

    try {

        // Reference
        let response
        let balance

        // Get Balance
        balance = await ethereumUtil.getETHBalance(address)
        response = {balance}

        return response

    } catch (error) {
        throw error
    }

}

module.exports = {
    balance
}
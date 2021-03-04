'use strict';

const p2pTokenUtil = require("../blockchain/smartContract/P2PToken")
const ethereumUtil = require("../blockchain/util")

async function balance(address){

    try {

        // Reference
        let response
        let balance

        // Validate Address
        await ethereumUtil.isAddressValid([address])

        // Get Balance
        balance = await p2pTokenUtil.balance(address)
        response = {balance}

        return response

    } catch (error) {
        throw error
    }

}

async function allowance(owner, spender){

    try {

        // Reference
        let response
        let balance

        // Validate Address
        await ethereumUtil.isAddressValid([owner, spender])

        // Get Balance
        balance = await p2pTokenUtil.allowance(owner, spender)
        response = {balance}

        return response

    } catch (error) {
        throw error
    }

}

async function transfer(from, to, amount, privateKey){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([from, to])

        // Get Balance
        txDetails = await p2pTokenUtil.transfer(from, to, amount, privateKey)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function approve(from, to, amount, privateKey){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([from, to])

        // Get Balance
        txDetails = await p2pTokenUtil.approve(from, to, amount, privateKey)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

module.exports = {
    balance,
    allowance,
    transfer,
    approve
}
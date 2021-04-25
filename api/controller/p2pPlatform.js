'use strict';

const p2pPlatformUtil = require("../blockchain/smartContract/P2PPlatform")
const p2pTokenUtil = require("../blockchain/smartContract/P2PToken")
const ethereumUtil = require("../blockchain/util")
const config = require("../config/config")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))
const util = require("../tools/util")

async function ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([from])

        // Get Data
        txDetails = await p2pPlatformUtil.ask(from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function request(){

    try {

        // Reference
        let response = []
        let tmpResponse = []
        let requestArray

        // Get Data
        requestArray = await p2pPlatformUtil.getRequests()

        // Iterate on Requests
        for(let i = 0; i < requestArray.length; i++){

            // Get Request Data
            let requestContractAddress = requestArray[i]
            let requestParam = await p2pPlatformUtil.getRequestParameters(requestContractAddress)
            let requestState = await p2pPlatformUtil.getRequestState(requestContractAddress)
            let colletralBalance = await p2pPlatformUtil.getColletralBalance(requestContractAddress)
            requestParam["requestContractAddress"] = requestContractAddress
            requestParam["colletralBalance"] = colletralBalance
            tmpResponse.push({...requestParam, ...requestState})
        }

        // Fix Data
        for(let i = 0; i < tmpResponse.length; i++){

            // Data
            let request = tmpResponse[i]
            let askAmount = await p2pTokenUtil.decimalBalance(request.askAmount)
            let paybackAmount = await p2pTokenUtil.decimalBalance(request.paybackAmount)
            let collateral = Web3.utils.fromWei(request.collateral, 'ether')
            let colletralBalance = Web3.utils.fromWei(request.colletralBalance, 'ether')
            let tmpRequest = {
                "requestContractAddress": request.requestContractAddress,
                "colletralBalance": colletralBalance,
                "asker": request.asker,
                "lender": request.lender,
                "askAmount": askAmount,
                "paybackAmount": paybackAmount,
                "purpose": request.purpose,
                "moneyLent": request.moneyLent,
                "debtSettled": request.debtSettled,
                "collateral": collateral,
                "collateralCollected": request.collateralCollected,
                "collateralCollectionTimeStamp": request.collateralCollectionTimeStamp,
                "currentTimeStamp": request.currentTimeStamp
            }
            response.push(tmpRequest)

        }

        return response

    } catch (error) {
        throw error
    }

}

async function cancel(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await p2pPlatformUtil.cancel(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function lend(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await p2pPlatformUtil.lend(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function payback(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await p2pPlatformUtil.payback(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function collect(from, privateKey, requestAddress){

    try {

        // Reference
        let response
        let txDetails

        // Validate Address
        await ethereumUtil.isAddressValid([requestAddress])

        // Get Data
        txDetails = await p2pPlatformUtil.collect(from, privateKey, requestAddress)
        response = {txDetails}

        return response

    } catch (error) {
        throw error
    }

}

async function askBatch(from, privateKey, transactionData){

    try {

        // Reference
        let response = []
        let txDetails
        let nonce

        // Get Nonce
        nonce = await web3.eth.getTransactionCount(from)

        // Iterate Over Transaction
        const iterateNewTransactions = async () => {
        await util.asyncForEach(transactionData, async (tx) => {
                
                 // Get Data
                txDetails = await p2pPlatformUtil.ask(from, tx.amount, privateKey, tx.paybackAmount, tx.purpose, tx.collateral, tx.collateralCollectionTimeStamp, nonce)
                response.push(txDetails)

                // Increment Nonce 
                nonce = nonce + 1
                
            });
        }
        await iterateNewTransactions()
        
       

        return response

    } catch (error) {
        throw error
    }

}


module.exports = {
    ask,
    request,
    cancel,
    lend,
    payback,
    collect,
    askBatch
}
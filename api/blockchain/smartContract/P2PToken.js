'use strict';

const config = require("../../config/config")
const bigNumber = require('bignumber.js')
const fs = require('fs')
const ethereumUtil = require("../util")
const userException = require('../../tools/userException')
const ErrorMessage = require("../../constants/errors").ErrorMessage
const Tx = require('ethereumjs-tx')
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))

async function p2pToken(){

    // Reference
    let contractObj
    let contractJSON
    let abi
    let address

    // Create Contract Object
    address = config.smartContract.p2pToken.address
    contractJSON = JSON.parse(fs.readFileSync(config.smartContract.p2pToken.buildPath));
    abi = contractJSON.abi;
    contractObj = new web3.eth.Contract(abi, address)

    return contractObj
}

async function balance(address) {

    // Contract Object
    let contract = await p2pToken()

    // Get Balance
    let balance = await contract.methods.balanceOf(address).call()

    // Decimal
    let decimals = await contract.methods.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance

}

async function allowance(owner, spender) {

    // Contract Object
    let contract = await p2pToken()

    // Get Balance
    let balance = await contract.methods.allowance(owner, spender).call()

    // Decimal
    let decimals = await contract.methods.decimals().call()
    balance = bigNumber(balance).div(10**decimals).toString()

    return balance

}

async function rawValue(value) {

    // Contract Object
    let contract = await p2pToken()

    let decimals = await contract.methods.decimals().call()
    return parseInt(value * (10**decimals))

}

async function decimalBalance(value) {

    // Contract Object
    let contract = await p2pToken()

    let decimals = await contract.methods.decimals().call()
    return bigNumber(value).div(10**decimals).toString()

}

async function signTransaction(rawTxObject, privateKey) {

    // Sign Transaction
    let tx = new Tx.Transaction(rawTxObject);
    // let tx = new Tx(rawTxObject); for Version 1.3.7
    tx.sign(Buffer.from(privateKey, 'hex'));
    let serializedTx = tx.serialize();
    var signedTx = "0x" + serializedTx.toString('hex');
    return signedTx

}

async function transfer(from, to, amount, privateKey) {

    try{

        // Contract Object
        let contract = await p2pToken()

        // TX Data
        amount = await rawValue(amount)
        amount = web3.utils.toHex(amount)

        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.p2pToken.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.transfer(to, amount).call()

        // Create Raw transaction (Frontend)
        let txData = contract.methods.transfer(to, amount).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.p2pToken.address,
            nonce : nonce,
            gasPrice: gasPrice,
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)

        // Broadcast Transaction ( Wallet / Custom(example : Infura) )
        let txDetails = await web3.eth.sendSignedTransaction(signedTransaction)

        // Return
        return txDetails

    } catch (error) {
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

async function approve(from, to, amount, privateKey) {

    try {

        // Contract Object
        let contract = await p2pToken()

        // TX Data
        amount = await rawValue(amount)
        amount = web3.utils.toHex(amount)

        let nonce = await web3.eth.getTransactionCount(from)
        nonce = web3.utils.toHex(nonce)

        let gasPrice = await ethereumUtil.getGasPrice()
        gasPrice = web3.utils.toHex(gasPrice)

        let gasLimit = web3.utils.toHex(config.smartContract.p2pToken.gasLimit)

        // Validate Transaction By Calling it first
        await contract.methods.approve(to, amount).call()

        // Create Raw transaction (Frontend)
        let txData = contract.methods.approve(to, amount).encodeABI()
        let rawTx = {
            gasLimit: gasLimit,
            data: txData,
            from: from,
            to: config.smartContract.p2pToken.address,
            nonce : nonce,
            gasPrice: gasPrice,
        }

        // Sign Transaction (Wallet)
        let signedTransaction = await signTransaction(rawTx, privateKey)

        // Broadcast Transaction ( Wallet / Custom(example : Infura) )
        let txDetails = await web3.eth.sendSignedTransaction(signedTransaction)

        // Return
        return txDetails

    } catch (error) {
        throw new userException(new ErrorMessage(error.data.stack, 500))
    }

}

module.exports = {
    balance,
    allowance,
    transfer,
    approve,
    p2pToken,
    rawValue,
    decimalBalance
}
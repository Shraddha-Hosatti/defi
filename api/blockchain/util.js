'use strict';

const config = require('../config/config.js')
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url));

async function isAddressValid(addresses){

  addresses.forEach(address => {

    // Check if Address is valid
    var isValid = web3.utils.isAddress(address)

    if (isValid == false){
      throw new userException(userErrors.InvalidAddress)
    }
  });

}

async function getGasPrice(){

  // Get Gas Price
  let gasPrice = await web3.eth.getGasPrice()
  gasPrice = parseInt(gasPrice)

  return gasPrice

}

async function getETHBalance(address) {

  // Check if Address is valid
  await isAddressValid([address])

  // Get Balance
  var balance = await web3.eth.getBalance(address)
  balance = await web3.utils.fromWei(balance, 'ether')

  return balance

}

module.exports = {
    getGasPrice,
    getETHBalance,
    isAddressValid
}
'use strict';

const config = require("../config/config")
const util = require("../tools/util")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))
const p2pPlatform = require("../blockchain/smartContract/P2PPlatform").p2pPlatform


async function main(txHash){

	try{

		// Read Transaction
		// var transactionObj = await web3.eth.getTransaction(txHash)

		// // HINT (Session 4 - Write script to decode smart contract transaction data)
	 //    // Decode Transaction
	 //    const abiDecoder = require('abi-decoder');
	 //    var contractObj = await p2pPlatform()
	 //    // console.log(contractObj)
	 //    abiDecoder.addABI(contractObj._jsonInterface)
	 //    var decodedData = abiDecoder.decodeMethod(transactionObj['input']);

	 //    // HINT (Session 4 - Extract function names and input params from decoded transaction data)
	 //    console.log(decodedData)

	 //    // HINT (Session 4 - Check if the above transaction has failed while executing smart contract function)
	 //    var txDataStatus = await web3.eth.getTransactionReceipt(transactionObj['hash'])
	 //    var success = txDataStatus["status"]
	 //    console.log("success", success)

	}catch (error) {
        console.error(error)
    }

	
}

let txHash = "0xc0eb27d81adfab19405e6a2cf0a20213724f833ea38bb4349954a2f164a9b927"
main(txHash)
'use strict';

// Global
var path = require('path');
var config = {}
var projectDirectory = path.resolve(__dirname, "..")
var smartContractDirectory = path.resolve(__dirname, "../../smart_contract")

// Enviornment
config.env = 'development'

/******************** Express Server config *************************/
config.server = {}
config.server.host = '0.0.0.0'
config.server.port = 5001
/******************** Express Server config *************************/

/******************** Blockchain *************************/
config.blockchain = {}
config.blockchain.url = "http://127.0.0.1:8545"
config.blockchain.chainId = "5777"
/******************** Blockchain *************************/

/******************** Smart Contract *************************/
config.smartContract = {}
config.smartContract.p2pToken = {}
config.smartContract.p2pToken.address = "0x8E417132e514f5F5a31AE6424758Dd36635AC7ae"
config.smartContract.p2pToken.gasLimit = 100000
config.smartContract.p2pToken.buildPath = smartContractDirectory + "/build/contracts/P2PToken.json"
config.smartContract.p2pPlatform = {}
config.smartContract.p2pPlatform.address = "0x350bD0D585A43013D05e947C55F84dEaa97271D7"
config.smartContract.p2pPlatform.gasLimit = 2000000
config.smartContract.p2pPlatform.buildPath = smartContractDirectory + "/build/contracts/P2PPlatform.json"
/******************** Smart Contract *************************/

/******************** Wallet *************************/
config.wallet = {}
/******************** Wallet *************************/

/**********************Logging***********************/
config.logs = {}
config.logs.consoleLogs = true
config.logs.fileLogs = false
config.logs.api = {}
config.logs.api.path = "/var/log/defi/"
config.logs.api.category = "API"
/**********************Logging***********************/

module.exports = config;
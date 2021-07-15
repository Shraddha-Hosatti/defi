'use strict';

const config = require("../config/config")
const util = require("../tools/util")
const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.url))

// Global (Must be saved in DB - Mongo or Redis)
var crawledBlocks = 0

async function ETHBlockCrawler() {

    try {

        // RPC - Get Current Block
        var currentBlock = await web3.eth.getBlockNumber()
        console.log("currentBlock : " + currentBlock)
        console.log("crawledBlocks : " + crawledBlocks)

        // Iterate Over Blocks
        var blockRange = util.range(Number(crawledBlocks) + 1, currentBlock + 1, 1)

        const iterateBlockNumber = async () => {
            await util.asyncForEach(blockRange, async (blockNumber) => {

                console.log("Crawling Block : " + blockNumber)

                // Get Transactions
                let transactionsObj = await web3.eth.getBlock(blockNumber, true)
                let listTransactionsObj = transactionsObj.transactions
               
                // Iterate Over Transaction
                const iterateNewTransactions = async () => {
                await util.asyncForEach(listTransactionsObj, async (transactionObj) => {
                        
                        // Print Transaction
                        console.log(transactionObj)

                        // HINT (Session 3 - Write script to capture blockchain transaction specific to your contract)
                        // To capture our smart contract tx
                        // transactionObj["to"] == config.smartContractAddress.p2pPlatform

                    });
                }
                await iterateNewTransactions()
                
                // Set Crawled Blocks
                crawledBlocks = blockNumber

            });
        }
        await iterateBlockNumber()


    } catch (error) {
        console.error("Block : " + error)
    }


}

async function main() {

    while (true) {

        // Start
        await ETHBlockCrawler()

        // Wait Ethereum Block Time
        await util.waitFor(15000)

    }
}

main()
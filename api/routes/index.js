
'use strict';
const express = require('express');
const router = express.Router();
const misc = require("../api/misc")
const p2pToken = require("../api/p2pToken")
const p2pPlatform = require("../api/p2pPlatform")
const ethereum = require("../api/ethereum")

// Misc
router.get("/v1/misc/ping", misc.ping)

// Ethereum
router.get("/v1/ethereum/balance", ethereum.balance)

// Token
router.get("/v1/p2pToken/balance", p2pToken.balance)
router.get("/v1/p2pToken/allowance", p2pToken.allowance)
router.post("/v1/p2pToken/transfer", p2pToken.transfer)
router.post("/v1/p2pToken/approve", p2pToken.approve)

// P2P Platform
router.post("/v1/p2pPlatform/ask", p2pPlatform.ask)
router.post("/v1/p2pPlatform/askBatch", p2pPlatform.askBatch)
router.get("/v1/p2pPlatform/request", p2pPlatform.request)
router.post("/v1/p2pPlatform/cancel", p2pPlatform.cancel)
router.post("/v1/p2pPlatform/lend", p2pPlatform.lend)
router.post("/v1/p2pPlatform/payback", p2pPlatform.payback)
router.post("/v1/p2pPlatform/collect", p2pPlatform.collect)

module.exports = router
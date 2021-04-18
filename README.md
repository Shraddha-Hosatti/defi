
# P2P-Lending

## About The Project

A decentralized, smart contract based platform for p2p-lending of any existing ERC20 Token on the Ethereum Blockchain with ETH as colletral.
The open ecosystem of the p2p-lending platform has the potential to offer cheaper lending contracts than traditional centralized institutions, while also enabling people all over the world to profit from a fair and transparent portfolio of products.

## Built With

- [Node 13](https://nodejs.org/en/)
- [Truffle](https://truffleframework.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
- [web3.js](https://web3js.readthedocs.io/en/1.0/getting-started.html)

## Prerequisites

These are the requisites you need, in order to use the software and instructions, on how to install them.

### NodeJS and NPM

```sh
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
```
### Ganache

Download it form this link https://truffleframework.com/ganache
### Truffle

```sh
npm install truffle -g
```

## Installation
### Clone the repo

```sh
git clone <Current_URL>
```

### Run Ganache on port 8545

```sh
Ganache -> Settings -> Server -> Port Number -> 8545
```

### Go to smart_contract folder and Install dependencies

```sh
npm install
```

### Compile Smart Contracts

```sh
truffle compile
```

### Deploy Smart Contracts to local blockchain

```sh
npm run migrate:dev
```

### Update Smart Contract address in config (get this from the ganache gui)

config.smartContractAddress.p2pToken

config.smartContractAddress.p2pPlatform

### Go to api folder and Install dependencies

```sh
npm install
```

### Start backend

```sh
npm run start
```

### API Document

https://www.getpostman.com/collections/bab6a07226f6791e2eda

## Understand the Smart contract

1. Create Ask Request with collateral as ETH
2. Get created requests from API -> get Requests
3. Give Token approval from Lender to above address (same amount as asked)
4. Call Lend Function from Lender
5. Transfer some extra token to asker so that he can payback
6. Payback from lender, Colletral will come back
7. Collect Collateral if not paid before deadline
8. Cancel Request before Lender pay

# Deploy on Ropsten Network

1. Set your Infura Key and Mnemonic as below (Use your existing seed or create new and transfer some ether to it)
2. Update "from" address in truffle-config.js which have funds

```sh
export INFURA_API_KEY="asdasd"
export MNEMONIC="asd asd ...."
```
# Frontend

Just a sample code for connecting to metamask and build a transaction
### Go to frontend folder and Install dependencies

```sh
npm install
```
### Start

```sh
npm run start
```

# Services

## Block Crawler (Sample)

To capture all blockchain transaction

```sh
cd api
node script/blockCrawler.js
```

# Troubleshoot
## Failed at the scrypt@6.0.3 install script.

```sh
sudo npm install github:barrysteyn/node-scrypt#fb60a8d3c158fe115a624b5ffa7480f3a24b03fb
```
## Cannot read property 'addFunction' of undefined

```sh
sudo npm update truffle
```

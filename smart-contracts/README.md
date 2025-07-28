# Earthrectify Contract

## Install

- `cd smart-contract`

```
npm install --save @truffle/hdwallet-provider
npm install --save dotenv
npm install --save @openzeppelin/contracts
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

```

## Deploy

- `truffle migrate --network hederaTestnet`

- Deploy a specific contract by selecting it's migration number `truffle migrate --network hederaTestnet --f 3 --to 3`

##

- ERECO_TOKEN_ADDRESS: 0x9f6055862d50E8B8C9bD29D59e3A8B0dE9b018A0
- VERECO_TOKEN_ADDRESS: 0x05A5B5f278d8Df7297b128D2C395A372DF7cDAeA

##

- And update your constants.js file in the frontend with the updated contract build and contract addresses

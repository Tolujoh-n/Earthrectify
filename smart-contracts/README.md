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

- ERECO_TOKEN_ADDRESS: 0x8264029aC2f6eB8c3f67F6b872Ab649875B10cF4
- VERECO_TOKEN_ADDRESS: 0x4da51ebebBE767C4a1C370ed108E220086D6c5de

##

- And update your constants.js file in the frontend with the updated contract build and contract addresses

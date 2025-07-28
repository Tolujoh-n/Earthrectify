require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    // Base Testnet Configuration
    hederaTestnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC, // Your wallet's mnemonic
          "https://testnet.hashio.io/api" // RPC URL for Hedera Testnet
        ),
      network_id: "*", // Network ID for Hedera Testnet: 296
      gas: 8000000, // Gas limit
      gasPrice: 350000000000, // Gas price (35 Gwei)
      timeoutBlocks: 200, // Increase timeout for deployment
      skipDryRun: true, // Skip dry run before migrations
    },
  },

  // Compiler settings
  compilers: {
    solc: {
      version: "0.8.20", // Specify the Solidity compiler version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Optimize for gas usage
        },
      },
    },
  },
};

// eslint-disable-next-line no-undef
const ERECOToken = artifacts.require("ERECOToken");

module.exports = async function (deployer, network, accounts) {
  const deployerAddress = accounts[0]; // This will be both the owner and recipient

  await deployer.deploy(ERECOToken, deployerAddress, deployerAddress);

  const token = await ERECOToken.deployed();
  console.log("ERECOToken deployed to:", token.address);
  console.log("Deployer/Owner/Recipient:", deployerAddress);
};

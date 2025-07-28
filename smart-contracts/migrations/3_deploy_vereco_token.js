// eslint-disable-next-line no-undef
const VERECOToken = artifacts.require("VERECOToken");

module.exports = async function (deployer, network, accounts) {
  const deployerAddress = accounts[0]; // This will be both the owner and recipient

  await deployer.deploy(VERECOToken, deployerAddress, deployerAddress);

  const token = await VERECOToken.deployed();
  console.log("VERECOToken deployed to:", token.address);
  console.log("Deployer/Owner/Recipient:", deployerAddress);
};

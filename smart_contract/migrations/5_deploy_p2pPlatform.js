const RequestFactory = artifacts.require("RequestFactory");
const Governance = artifacts.require("Governance");
const P2PPlatform = artifacts.require("P2PPlatform");

module.exports = async deployer => {
    const requestFactory = await RequestFactory.deployed();
    const governance = await Governance.deployed();

    await deployer.deploy(P2PPlatform, requestFactory.address, governance.address);
};

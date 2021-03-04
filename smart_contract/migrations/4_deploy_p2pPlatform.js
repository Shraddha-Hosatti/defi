const RequestFactory = artifacts.require("RequestFactory");
const P2PPlatform = artifacts.require("P2PPlatform");

module.exports = async deployer => {
    const requestFactory = await RequestFactory.deployed();

    await deployer.deploy(P2PPlatform, requestFactory.address);
};

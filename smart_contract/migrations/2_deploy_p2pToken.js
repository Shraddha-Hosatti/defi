const P2PToken = artifacts.require("P2PToken");

const tokenSupply = 10000000;
const tokenName = "P2PToken";
const tokenDecimals = 0;
const tokenSymbol = "P2PT";

module.exports = deployer => {
    deployer.deploy(
        P2PToken,
        tokenSupply,
        tokenName,
        tokenDecimals,
        tokenSymbol
    );
};

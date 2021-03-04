const RequestFactory = artifacts.require("RequestFactory");

module.exports = async deployer => {
    
    await deployer.deploy(RequestFactory);
    
};

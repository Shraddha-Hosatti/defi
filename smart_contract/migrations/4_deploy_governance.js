const Governance = artifacts.require("Governance");

module.exports = async deployer => {

	var minimumNumberOfVotes = 1;
    
    await deployer.deploy(Governance, minimumNumberOfVotes);
    
};

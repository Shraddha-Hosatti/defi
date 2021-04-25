const Web3 = require('web3');
import Voting from "../contract/Voting.json";

export default address => {
  return new Web3.eth.Contract(JSON.parse(Voting.interface), address);
};

// wherever you want to use the contract just import Voting from this file and declare obj like
// const Voting = Voting(address) where address is the address of the deployed contract

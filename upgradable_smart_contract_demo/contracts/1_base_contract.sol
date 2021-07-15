// SPDX-License-Identifier: DEFI
pragma solidity 0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract UpgradableSmartContract is Initializable {

    string public name;
    uint256 public value;
    
	function initialize(string memory _name) initializer public {
        name = _name;
    }

    function setValue(uint256 x) public returns (bool) {
        value = x + 2000;
        return true;
    }

}
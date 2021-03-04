// SPDX-License-Identifier: DEFI

pragma solidity 0.7.0; // Solidity compiler version
import "./LendingRequest.sol";

contract RequestFactory {
    
    /**
     * @notice creates a new lendingRequest
     * @param _amount the amount the asker wants to borrow
     * @param _paybackAmount the amoun the asker is willing to pay the lender after getting the loan
     * @param _purpose the reason the asker wants to borrow money
     * @param _origin origin address of the call -> address of the asker
     */
    function createLendingRequest(
        uint256 _amount,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _origin,
        address payable _token,
        uint256 _collateral,
        uint256 _collateralCollectionTimeStamp
    ) public payable returns (address payable lendingRequest) {
        
        // create new lendingRequest contract
        lendingRequest = address(uint160(address(
            new LendingRequest{value: msg.value}(
                _origin, _amount, _paybackAmount,
                _purpose, msg.sender, _token, _collateral, _collateralCollectionTimeStamp)
        )));
    }
}
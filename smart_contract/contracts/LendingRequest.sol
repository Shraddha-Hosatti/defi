// SPDX-License-Identifier: DEFI

pragma solidity 0.7.0; // Solidity compiler version
import "./ERC20Interface.sol"; // ERC20 Interface

contract LendingRequest {

    // State Variables
    address payable private managementContract;
    address payable private token;
    address payable public asker;
    address payable public lender;
    bool public moneyLent;
    bool public debtSettled;
    uint256 public collateral;
    uint256 public amountAsked;
    uint256 public paybackAmount;
    string public purpose;
    uint256 public collateralCollectionTimeStamp;
    bool public collateralCollected;

    constructor(
        address payable _asker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _managementContract,
        address payable _token,
        uint256 _collateral,
        uint256 _collateralCollectionTimeStamp
    ) payable {
        asker = _asker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        purpose = _purpose;
        managementContract = _managementContract;
        token = _token;
        collateral = _collateral;
        collateralCollectionTimeStamp = _collateralCollectionTimeStamp;
    }

    /**
     * @notice deposit the ether that is being sent with the function call
     * @param _origin the address of the initial caller of the function
     * @return success true on success - false otherwise
     */
    function lend(address payable _origin) external returns (bool success) {
        /*
        Lending Request is being covered by lender
        checks:
            must not be covered twice (!moneyLent)
            must not be covered if the debt has been settled
            must not be covered by the asker
            has to be covered with one transaction
         */

        // Check
        require(_origin != asker, "Invalid Lender");
        require(!moneyLent, "Money Already Lented");
        require(!collateralCollected, "Collateral already collected" );

        // Check balance
        uint balance = ERC20Interface(token).allowance(_origin, address(this));
        require(balance >= amountAsked, "Balance is less than asked amount");

        // Transfer token
        require(ERC20Interface(token).transferFrom(_origin, asker, amountAsked), "Transfer Failed");

        // Set Data
        moneyLent = true;
        lender = _origin;

        // return
        return true;

    }

    /**
     * @notice deposit the ether that is being sent with the function call
     * @param _origin the address of the initial caller of the function
     * @return success true on success - false otherwise
     */
    function payback(address payable _origin) external returns (bool success) {
        /*
        Asker pays back the debt
        checks:
            cannot pay back the debt if money has yet to be lent
            must not be paid back twice
            has to be paid back by the asker
         */

        // Checks
        require(_origin == asker, "Invalid Asker");
        require(moneyLent && !debtSettled, "Operation Not Permitted");
        require(!collateralCollected, "Collateral already collected" );

        // Check balance
        uint balance = ERC20Interface(token).allowance(_origin, address(this));
        require(balance >= paybackAmount, "Insufficient Balance");

        // Transfer token
        require(ERC20Interface(token).transferFrom(_origin, lender, paybackAmount), "Transfer Failed");

        // Remove collateral
        _origin.transfer(address(this).balance);

        // Set Data
        debtSettled = true;

        // return
        return true;

    }

    /**
     * @notice cancels the request if possible
     */
    function collectCollateral(address _origin) external returns (bool success){

        // Check
        require(_origin == lender, "Invalid Lender");

        // Check
        require(moneyLent == true && debtSettled == false, "Money Not Lent");

        // Check Collateral
        require(!collateralCollected, "Collateral already collected" );
        require(block.timestamp >= collateralCollectionTimeStamp, "Too soon to collect Collteral");

        // Update State
        collateralCollected = true;

        // Transfer ether
        lender.transfer(address(this).balance);

        // returns
        return true;
    }

    /**
     * @notice cancels the request if possible
     */
    function cancelRequest(address _origin) external returns (bool success){

        // Check
        require(_origin == asker, "Invalid Asker");
        require(moneyLent == false && debtSettled == false && collateralCollected == false, "Can not Cancel Now");

        // Update State
        collateralCollected = true;

        // Transfer Ether back
        asker.transfer(address(this).balance);

        // returns
        return true;
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestParameters() external view
        returns (address payable, address payable, uint256, uint256, string memory) {
        return (asker, lender, amountAsked, paybackAmount, purpose);
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestState() external view
        returns (bool, bool, uint256, bool, uint256, uint256) {
        return (moneyLent, debtSettled, collateral, collateralCollected, collateralCollectionTimeStamp, block.timestamp);
    }

}
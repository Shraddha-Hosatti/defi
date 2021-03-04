pragma solidity 0.7.0; // Solidity compiler version

// *********************** Interfaces - Starts ************************* //

interface ERC20Interface {
    
    /// @param _owner The address from which the balance will be retrieved
    /// @return balance The balance
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @notice Send '_value' token to '_to' from 'msg.sender'
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) external returns (bool success);

    /// @notice Send '_value' token to '_to' from '_from' on the condition it is approved by '_from'
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

    /// @notice 'msg.sender' approves '_spender' to spend '_value' tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of tokens to be approved for transfer
    /// @return success Whether the approval was successful or not
    function approve(address _spender, uint256 _value) external returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return remaining Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    // Display transactions and approvals
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

interface RequestFactoryInterface {
    function createLendingRequest(uint256, uint256, string calldata, address payable) external returns(address);
}

interface LendingRequestInterface {
    function lend(address payable) external payable returns(bool);
    function payback(address payable) external payable returns(bool);
    function askerWithdraw(address) external;
    function lenderWithdrawBeforeAsker(address) external;
    function lenderWithdrawPayback(address) external;
    function cleanUp() external;
    function cancelRequest() external;
    function asker() external view returns(address payable);
    function withdrawnByLender() external view returns(bool);
    function getRequestParameters() external view returns(address payable, address payable, uint256, uint256, uint256, string memory);
    function getRequestState() external view returns(bool, bool, bool, bool);
}

// *********************** Interfaces - Ends ************************* //

// *********************** Library - Starts ************************* //

/**
 * @title SafeMath
 * @dev Unsigned math operations with safety checks that revert on error.
 */
library SafeMath {
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}

// *********************** Library - Ends ************************* //

// *********************** ERC20 - Starts ************************* //

contract P2PToken is ERC20Interface {
    
    // State Variables
    using SafeMath for uint256;
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 public decimals;

    // State Mappings
    mapping (address => uint256) private tokenBalances;                         // token balance of trustees
    mapping (address => mapping (address => uint256)) public allowed;           // register of all permissions form one user to another

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) {
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
        totalSupply = _initialAmount.mul(10 ** uint256(decimals));
        tokenBalances[msg.sender] = totalSupply;
    }

    /**
     * @notice Send '_value' token to '_to' from 'msg.sender'
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return success Whether the transfer was successful or not
     */
    function transfer(address _to, uint256 _value) public override returns (bool success) {
        require(tokenBalances[msg.sender] >= _value, "insufficient funds");

        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(_value);
        tokenBalances[_to] = tokenBalances[_to].add(_value);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    /**
     * @notice Send '_value' token to '_to' from '_from' on the condition it is approved by '_from'
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return success Whether the transfer was successful or not
     */
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(allowance >= _value, "insufficient allowance");
        require(tokenBalances[_from] >= _value, "invalid transfer amount");

        tokenBalances[_to] = tokenBalances[_to].add(_value);
        tokenBalances[_from] = tokenBalances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        emit Transfer(_from, _to, _value);
        
        return true;
    }

    /**
     * @notice 'msg.sender' approves '_spender' to spend '_value' tokens
     * @param _spender The address of the account able to transfer the tokens
     * @param _value The amount of tokens to be approved for transfer
     * @return success Whether the approval was successful or not
     */
    function approve(address _spender, uint256 _value) public override returns (bool success) {
        require(balanceOf(msg.sender) >= _value, "insufficient funds");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * @param _owner The address of the account owning tokens
     * @param _spender The address of the account able to transfer the tokens
     * @return remaining Amount of remaining tokens allowed to spent
     */
    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    /**
     * @param _owner The address from which the balance will be retrieved
     * @return balance The balance
     */
    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return tokenBalances[_owner];
    }
}

// *********************** ERC20 - Ends ************************* //

// *********************** P2PLendingAndBorrowing - Starts ************************* // 

contract LendingRequest {
    
    // State Variables
    address payable private managementContract;
    address payable private token;
    address payable public asker;
    address payable public lender;
    bool private withdrawnByAsker;
    bool public withdrawnByLender;
    bool public moneyLent;
    bool public debtSettled;
    uint256 public amountAsked;
    uint256 public paybackAmount;
    uint256 public contractFee;
    string public purpose;

    constructor(
        address payable _asker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        uint256 _contractFee,
        string memory _purpose,
        address payable _managementContract,
        address payable _token
    ) public {
        asker = _asker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        contractFee = _contractFee;
        purpose = _purpose;
        managementContract = _managementContract;
        token = _token;
    }

    /**
     * @notice deposit the ether that is being sent with the function call
     * @param _origin the address of the initial caller of the function
     * @return success true on success - false otherwise
     */
    function lend(address payable _origin) external payable returns (bool success) {
        /*
        Lending Request is being covered by lender
        checks:
            must not be covered twice (!moneyLent)
            must not be covered if the debt has been settled
            must not be covered by the asker
            has to be covered with one transaction
         */
         
        // Check
        require(_origin != asker, "invalid lender");
        require(msg.value == amountAsked, "Amount is less than asked amount");
        require(!moneyLent, "Operation Not Permitted");
        
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
    function payback(address payable _origin) external payable returns (bool success) {
        /*
        Asker pays back the debt
        checks:
            cannot pay back the debt if money has yet to be lent
            must not be paid back twice
            has to be paid back by the asker
            must be paid back in one transaction and has to include contractFee
         */
         
        // Checks
        require(_origin == asker, "invalid paybackaddress");
        require(msg.value == (paybackAmount + contractFee), "invalid payback");
        require(moneyLent && !debtSettled, "Operation Not Permitted");
    
        // Set Data
        debtSettled = true;
        
        // return
        return true;
            
    }

    
    /**
     * @notice withdraw the current balance of the contract
     * @param _origin the address of the initial caller of the function
     */
    function askerWithdraw(address _origin) external {
        /*
         * Borrow withdraws amountAsked
         *      checks:
         *          must only be callable by asker
         *          money has to be lent first
         */
         
        // Checks
        require(moneyLent, "Money Not Lent");
        require(lender != address(0), "Invalid lender");
        require(_origin == asker, "Only asker can call this");
        require(!debtSettled, "Debt Already settled");
        
        // Set Data
        withdrawnByAsker = true;
        
        // Transfer Amount
        asker.transfer(address(this).balance);
    }
    
    /**
     * @notice withdraw the current balance of the contract
     * @param _origin the address of the initial caller of the function
     */
    function lenderWithdrawBeforeAsker(address _origin) external {
        /*
         * lender withdraws amountAsked
         *      checks:
         *          must only be callable by the lender
         *          asker must not have withdrawn amountAsked
         *      reset moneyLent status
         */
        
        // Checks
        require(moneyLent, "Money Not Lent");
        require(lender != address(0), "Invalid lender");
        require(_origin == lender, "Only Lender can call this");
        require(!debtSettled, "Debt already settled");
        require(!withdrawnByAsker, "AMount already withdrawn by asker");
        
        // Set Data
        moneyLent = false;
        
        // Transfer Amou
        lender.transfer(address(this).balance);
        
        // Reset Lender
        lender = address(0);
       
    }
    
    /**
     * @notice withdraw the current balance of the contract
     * @param _origin the address of the initial caller of the function
     */
    function lenderWithdrawPayback(address _origin) external {
        /*
         * lender withdraws paybackAmount
         *      checks:
         *          must only be callable by the lender
         *          debt has to be repaid first
         *      contractFee has to remain with the contract
         */
        
        // Checks
        require(moneyLent, "Money Not Lent");
        require(lender != address(0), "Invalid lender");
        require(_origin == lender, "Only Lender can call this");
        require(debtSettled, "Debt not settled");
        
        // Set Data
        withdrawnByLender = true;
        
        // transfer Money
        lender.transfer(address(this).balance - contractFee); // TODO Fee
    
    }

    /**
     * @notice destroys the lendingRequest contract and forwards all remaining funds to the management contract
     */
    function cleanUp() external {
        require(msg.sender == managementContract, "cleanUp failed");
        selfdestruct(token);
    }

    /**
     * @notice cancels the request if possible
     */
    function cancelRequest() external {
        require(msg.sender == managementContract, "invalid caller");
        require(moneyLent == false && debtSettled == false, "invalid conditions");
        selfdestruct(asker);
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestParameters() external view
        returns (address payable, address payable, uint256, uint256, uint256, string memory) {
        return (asker, lender, amountAsked, paybackAmount, contractFee, purpose);
    }

    /**
     * @notice getter for proposal state
     */
    function getRequestState() external view returns (bool, bool, bool, bool) {
        return (moneyLent, withdrawnByAsker, withdrawnByLender, debtSettled);
    }
}

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
        uint256 _contractFee,
        address payable _token
    ) public returns (address lendingRequest) {
        
        // create new lendingRequest contract
        lendingRequest = address(
            new LendingRequest(
                _origin, _amount, _paybackAmount,
                _contractFee, _purpose, msg.sender, _token)
        );
    }
}

contract RequestManagement {
    
    // Events
    event RequestCreated();
    event RequestGranted();
    event DebtPaid();
    event Withdraw();

    // State mapping
    mapping(address => uint256) private requestIndex;
    mapping(address => uint256) private userRequestCount;
    mapping(address => bool) private validRequest;

    // State Variables
    address private requestFactory;
    address[] private lendingRequests;

    constructor(address _factory) public {
        requestFactory = _factory;
    }

    /**
     * @notice Creates a lending request for the amount you specified
     * @param _amount the amount you want to borrow in Wei
     * @param _paybackAmount the amount you are willing to pay back - has to be greater than _amount
     * @param _purpose the reason you want to borrow ether
     */
    function ask (uint256 _amount, uint256 _paybackAmount, string memory _purpose) public returns(bool success){
        // validate the input parameters
        require(_amount > 0, "invalid amount");
        require(_paybackAmount > _amount, "invalid payback");
        // require(lendingRequests[msg.sender].length < 5, "too many requests");
        require(userRequestCount[msg.sender] < 5, "too many requests");

        // create new lendingRequest
        address request = RequestFactoryInterface(requestFactory).createLendingRequest(
            _amount,
            _paybackAmount,
            _purpose,
            msg.sender
        );

        // update number of requests for asker
        userRequestCount[msg.sender]++;
        // add created lendingRequest to management structures
        requestIndex[request] = lendingRequests.length;
        lendingRequests.push(request);
        // mark created lendingRequest as a valid request
        validRequest[request] = true;

        emit RequestCreated();
        
        return true;
    }

    /**
     * @notice Lend ether amount of the lendingRequest (costs ETHER)
     * @param _lendingRequest the address of the lendingRequest you want to deposit ether in
     */
    function lend(address payable _lendingRequest) public payable {
        
        // Checks
        require(validRequest[_lendingRequest], "invalid request");
        require(msg.value > 0, "invalid value");

        bool success = LendingRequestInterface(_lendingRequest).lend{value: msg.value}(msg.sender);
        require(success, "Lending failed");

        // Emit Event
        emit RequestGranted();
        
    }
    
    /**
     * @notice payback the ether amount of the lendingRequest (costs ETHER)
     * @param _lendingRequest the address of the lendingRequest you want to deposit ether in
     */
    function payback(address payable _lendingRequest) public payable {
        
        // Checks
        require(validRequest[_lendingRequest], "invalid request");
        require(msg.value > 0, "invalid value");

        bool success = LendingRequestInterface(_lendingRequest).payback{value: msg.value}(msg.sender);
        require(success, "payback failed");

        // Emit Event
        emit RequestGranted();
        
    }

    /**
     * @notice withdraw Ether from the lendingRequest
     * @param _lendingRequest the address of the lendingRequest to withdraw from
     */
    function askerWithdraw(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid request");

        LendingRequestInterface(_lendingRequest).askerWithdraw(msg.sender);

        emit Withdraw();
    }
    
    /**
     * @notice withdraw Ether from the lendingRequest
     * @param _lendingRequest the address of the lendingRequest to withdraw from
     */
    function lenderWithdrawBeforeAsker(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid request");

        LendingRequestInterface(_lendingRequest).lenderWithdrawBeforeAsker(msg.sender);

        emit Withdraw();
    }
    
    /**
     * @notice withdraw Ether from the lendingRequest
     * @param _lendingRequest the address of the lendingRequest to withdraw from
     */
    function lenderWithdrawPayback(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid request");

        LendingRequestInterface(_lendingRequest).lenderWithdrawPayback(msg.sender);

        // if paybackAmount was withdrawn by lender reduce number of openRequests for asker
        if(LendingRequestInterface(_lendingRequest).withdrawnByLender()) {
            address payable asker = LendingRequestInterface(_lendingRequest).asker();
            // call selfdestruct of lendingRequest
            LendingRequestInterface(_lendingRequest).cleanUp();
            // remove lendingRequest from managementContract
            removeRequest(_lendingRequest, asker);
        }

        emit Withdraw();
    }


    /**
     * @notice cancels the request
     * @param _lendingRequest the address of the request to cancel
     */
    function cancelRequest(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid Request");

        LendingRequestInterface(_lendingRequest).cancelRequest();
        removeRequest(_lendingRequest, msg.sender);

        emit Withdraw();
    }

    /**
     * @notice gets the lendingRequests for the specified user
     * @return all lendingRequests
     */
    function getRequests() public view returns(address[] memory) {
        return lendingRequests;
    }

    function getRequestParameters(address payable _lendingRequest)
        public
        view
        returns (address asker, address lender, uint256 askAmount, uint256 paybackAmount, uint256 contractFee, string memory purpose) {
        (asker, lender, askAmount, paybackAmount, contractFee, purpose) = LendingRequestInterface(_lendingRequest).getRequestParameters();
    }

    function getRequestState(address payable _lendingRequest)
        public
        view
        returns (bool verifiedAsker, bool lent, bool withdrawnByAsker, bool debtSettled) {
        return LendingRequestInterface(_lendingRequest).getRequestState();
    }

    /**
     * @notice removes the lendingRequest from the management structures
     * @param _request the lendingRequest that will be removed
     */
    function removeRequest(address _request, address _sender) private {
        // validate input
        require(validRequest[_request], "invalid request");

        // update number of requests for asker
        userRequestCount[_sender]--;
        
        // remove _request from the management contract
        uint256 idx = requestIndex[_request];
        if(lendingRequests[idx] == _request) {
            requestIndex[lendingRequests[lendingRequests.length - 1]] = idx;
            lendingRequests[idx] = lendingRequests[lendingRequests.length - 1];
            lendingRequests.pop();
        }
        // mark _request as invalid lendingRequest
        validRequest[_request] = false;
    }
}

// *********************** P2PLendingAndBorrowing - Ends ************************* // 
// SPDX-License-Identifier: DEFI

pragma solidity 0.7.0; // Solidity compiler version
import "./ERC20Interface.sol"; // ERC20 Interface
import "./SafeMath.sol"; // ERC20 Interface

contract P2PToken is ERC20Interface {

    // State Variables
    using SafeMath for uint256;
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 public decimals;
    address public owner;

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
        owner = msg.sender;
    }

    /**
     * @notice Send '_value' token to '_to' from 'msg.sender'
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return success Whether the transfer was successful or not
     */
    function transfer(address _to, uint256 _value) public override returns (bool success) {

        // Check Balance
        require(tokenBalances[msg.sender] >= _value, "insufficient funds");

        // Transfer Amount
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(_value);
        tokenBalances[_to] = tokenBalances[_to].add(_value);

        // Emit Event
        emit Transfer(msg.sender, _to, _value);

        // Return
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

        // reference
        uint256 allowance = allowed[_from][msg.sender];

        // Check Balance
        require(allowance >= _value, "insufficient allowance");
        require(tokenBalances[_from] >= _value, "invalid transfer amount");

        // transfer amout
        tokenBalances[_to] = tokenBalances[_to].add(_value);
        tokenBalances[_from] = tokenBalances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        // Emit Event
        emit Transfer(_from, _to, _value);

        // return
        return true;
    }

    /**
     * @notice 'msg.sender' approves '_spender' to spend '_value' tokens
     * @param _spender The address of the account able to transfer the tokens
     * @param _value The amount of tokens to be approved for transfer
     * @return success Whether the approval was successful or not
     */
    function approve(address _spender, uint256 _value) public override returns (bool success) {

        // Check approval
        require(balanceOf(msg.sender) >= _value, "insufficient funds");

        // Provide approval
        allowed[msg.sender][_spender] = _value;

        // Emit Event
        emit Approval(msg.sender, _spender, _value);

        // Return
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
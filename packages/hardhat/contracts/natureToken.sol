// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NatureToken is ERC20, Ownable {
    mapping(address => bool) public authorizedMinters;
    address public admin;
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "Caller is not an authorized minter");
        _;
    }
    
    constructor(address _admin) ERC20("NATURE", "NTR") Ownable(msg.sender) {
        require(_admin != address(0), "Admin cannot be zero address");
        admin = _admin;  // Fixed assignment operator
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }
    
    function setAuthorizedMinter(address _minter) public onlyAdmin {
        require(_minter != address(0), "Cannot add zero address as minter");
        authorizedMinters[_minter] = true;
    }
    
    function removeAuthorizedMinter(address _minter) public onlyAdmin {
        require(_minter != address(0), "Cannot remove zero address as minter");
        authorizedMinters[_minter] = false;
    }

    function suck(uint256 amount, address _to) public onlyAuthorizedMinter {
        require(_to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        _mint(_to, amount);
    }
}

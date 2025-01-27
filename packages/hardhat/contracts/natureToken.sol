// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the ERC20 standard implementation and Ownable contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NatureToken is ERC20, Ownable {
    // Mapping to store authorized minters
    mapping(address => bool) public authorizedMinters;

    // Address of the admin who has special privileges
    address public admin;

    // Modifier to restrict access to only authorized minters
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "Caller is not an authorized minter");
        _;
    }

    // Constructor to initialize the token and admin address
    constructor(address _admin) ERC20("NATURE", "NTR") Ownable(msg.sender) {
        // Ensure admin address is valid
        require(_admin != address(0), "Admin cannot be zero address");
        admin = _admin; // Assign admin address
    }

    // Modifier to restrict access to the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    // Function to authorize a new minter (only callable by admin)
    function setAuthorizedMinter(address _minter) public onlyAdmin {
        require(_minter != address(0), "Cannot add zero address as minter");
        authorizedMinters[_minter] = true; // Mark the address as an authorized minter
    }

    // Function to remove an authorized minter
    function removeAuthorizedMinter(address _minter) public onlyAdmin {
        require(_minter != address(0), "Cannot remove zero address as minter");
        authorizedMinters[_minter] = false; // Revoke minter authorization
    }

    // Function to mint new tokens (restricted to authorized minters)
    function suck(uint256 amount, address _to) public onlyAuthorizedMinter {
        require(_to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        _mint(_to, amount); // Mint tokens to the specified address
    }
}
//@swarecito Do you want me to rather create a set of admins as well since authorized minters can refer to multiple agents if while still under one admin ? 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NatureToken is ERC20, Ownable {
    address public authorizedMinter; //Rewards agent is the authorized minter and can mint the required tokens to their wallet address 
    
    constructor(address _authorizedMinter) ERC20("NATURE", "NTR") Ownable(msg.sender) {
        require(_authorizedMinter != address(0), "Authorized minter cannot be zero address");
        authorizedMinter = _authorizedMinter;
    }
    
    modifier onlyAuthorizedMinter() {
        require(msg.sender == authorizedMinter, "Only authorized minter can call this function");
        _;
    }
    
    function suck(uint256 amount) public onlyAuthorizedMinter {
        _mint(msg.sender, amount);  // Mints directly to the caller's address
    }
}

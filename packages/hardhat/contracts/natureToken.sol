// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //! @tezz - Fix the compiler version to one specific version (best practice)

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NatureToken is ERC20, Ownable {
    //* @tezz - I would have an array of addresses that are allowed to mint the tokens
    address public authorizedMinter; //Rewards agent is the authorized minter and can mint the required tokens to their wallet address

    constructor(address _authorizedMinter) ERC20("NATURE", "NTR") Ownable(msg.sender) {
        require(_authorizedMinter != address(0), "Authorized minter cannot be zero address");
        authorizedMinter = _authorizedMinter;
    }

    //? @tezz - Let's add a setter to change the authorized minter
    modifier onlyAuthorizedMinter() {
        require(msg.sender == authorizedMinter, "Only authorized minter can call this function");
        _;
    }

    //* @tezz - I would use the transfer function to do the transfer. But if we use this one why not to add a `to` param to send the tokens to another address?
    function suck(uint256 amount) public onlyAuthorizedMinter {
        _mint(msg.sender, amount); // Mints directly to the caller's address
    }
}

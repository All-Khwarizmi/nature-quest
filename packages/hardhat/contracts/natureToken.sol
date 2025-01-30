// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NatureToken
 * @notice ERC20 token for Nature Quest's reward system on Mode Network
 * @dev Implements a role-based system with Owner, Admins, and Agents
 * Owner: Contract deployer, can manage admins
 * Admins: Can manage agents
 * Agents: AI-powered reward distributors
 */
contract NatureToken is ERC20, Ownable, ReentrancyGuard {
    // Role management
    mapping(address => bool) public admins;
    mapping(address => bool) public agents;

    event TokensFunded(address indexed to, uint256 amount, address indexed by);
    /**
     * @notice Emitted when a new admin is added
     * @param admin Address of the new admin
     */
    event AdminAdded(address indexed admin);

    /**
     * @notice Emitted when an admin is removed
     * @param admin Address of the removed admin
     */
    event AdminRemoved(address indexed admin);

    /**
     * @notice Emitted when a new agent is authorized
     * @param agent Address of the new agent
     * @param addedBy Admin who authorized the agent
     */
    event AgentAuthorized(address indexed agent, address indexed addedBy);

    /**
     * @notice Emitted when an agent is removed
     * @param agent Address of the removed agent
     * @param removedBy Admin who removed the agent
     */
    event AgentRemoved(address indexed agent, address indexed removedBy);

    modifier onlyAdmin() {
        require(admins[msg.sender], "NatureToken: caller is not admin");
        _;
    }

    modifier onlyAgent() {
        require(agents[msg.sender], "NatureToken: caller is not agent");
        _;
    }

    modifier onlyAdminOrAgent() {
        require(admins[msg.sender] || agents[msg.sender], "NatureToken: caller is not admin or agent");
        _;
    }

    /**
     * @notice Contract constructor
     * @param initialAdmin Address of the first admin
     */
    constructor(address initialAdmin) ERC20("NATURE", "NTR") Ownable() {
        require(initialAdmin != address(0), "NatureToken: invalid admin address");
        admins[initialAdmin] = true;
        emit AdminAdded(initialAdmin);
    }

    /**
     * @notice Add a new admin
     * @dev Only callable by contract owner
     * @param newAdmin Address to be added as admin
     */
    function addAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "NatureToken: invalid admin address");
        require(!admins[newAdmin], "NatureToken: already admin");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    /**
     * @notice Remove an admin
     * @dev Only callable by contract owner
     * @param admin Address to be removed from admins
     */
    function removeAdmin(address admin) external onlyOwner {
        require(admins[admin], "NatureToken: not admin");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    /**
     * @notice Authorize a new agent
     * @dev Only callable by admins
     * @param agent Address to be authorized as agent
     */
    function authorizeAgent(address agent) external onlyAdmin {
        require(agent != address(0), "NatureToken: invalid agent address");
        require(!agents[agent], "NatureToken: already agent");
        agents[agent] = true;
        emit AgentAuthorized(agent, msg.sender);
    }

    /**
     * @notice Remove an agent
     * @dev Only callable by admins
     * @param agent Address to be removed from agents
     */
    function removeAgent(address agent) external onlyAdmin {
        require(agents[agent], "NatureToken: not agent");
        agents[agent] = false;
        emit AgentRemoved(agent, msg.sender);
    }

    /**
     * @notice Mint tokens to specified address
     * @dev Only callable by admins or agents
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function fundTokens(address to, uint256 amount) external onlyAdminOrAgent nonReentrant {
        require(to != address(0), "NatureToken: invalid recipient");
        require(amount > 0, "NatureToken: invalid amount");

        _mint(to, amount);
        emit TokensFunded(to, amount, msg.sender);
    }

    /**
     * @notice Check if an address is an admin
     * @param account Address to check
     * @return bool True if address is admin
     */
    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }

    /**
     * @notice Check if an address is an agent
     * @param account Address to check
     * @return bool True if address is agent
     */
    function isAgent(address account) external view returns (bool) {
        return agents[account];
    }
}

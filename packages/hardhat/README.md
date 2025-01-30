# Nature Quest - Agent & Smart Contract Documentation

## Overview

Nature Quest is a decentralized citizen science platform where users complete nature-related quests and get rewarded with NTR tokens. The system uses AI agents and smart contracts to process rewards securely.

## Deployed Contract

- **Network**: Mode Testnet
- **Contract Address**: `0xC259F77B7d010F9D9DE46de1018788ef69620625`
- **Token Symbol**: NTR

## Contract Architecture

The NatureToken contract implements a role-based system:

- **Owner**: Contract deployer, can manage admins
- **Admins**: Can authorize/remove agents
- **Agents**: AI-powered entities that can fund tokens and process rewards

### Key Features

- Standard ERC20 token functionality
- Role-based access control
- Secure funding mechanism

## AI Agent System

The platform uses intelligent agents to:

- Validate quest completions
- Process rewards
- Ensure secure distribution

## Local Setup Guide

1. **Environment Configuration**

```env
# .env.local
NEXT_PUBLIC_AGENT_ADDRESS=your_agent_address
AGENT_PRIVATE_KEY=your_agent_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC259F77B7d010F9D9DE46de1018788ef69620625
```

2. **Chain Configuration**
   Ensure your constants file has: (to have the agent talking to the local chain and not the testnet use the commented values and change the contract address to the local contract address)

```typescript
//packages/nextjs/app/api/quest/constants.ts
export const CHAIN_ID = 919; // 31337
export const CHAIN = modeTestnet; // hardhat

//packages/nextjs/scaffold.config.ts

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.modeTestnet], // chains.hardhat
};
```

3. **Agent Authorization Flow**
   Before the agent can operate:
1. Contract owner must add an admin
1. Admin must authorize the agent
1. Admin/agent must fund the agent with tokens

1. **Interacting with Contract**

- Use the debug page to interact directly with contract functions
- Test different roles (owner/admin/agent)
- Monitor events and transactions

## Common Operations

### Adding a New Agent

1. Ensure you have admin access
2. Call `authorizeAgent(address)`
3. Fund the agent with tokens

### Processing Rewards

1. Agent validates quest completion
2. Agent transfers tokens to user
3. Transaction gets recorded on-chain

### Checking Quest Status

- Monitor `TokensFunded` events for distribution history

## Security Notes

- Keep private keys secure
- Only authorized agents should process rewards
- Monitor token distribution patterns
- Regular balance checks recommended

## Testing & Debugging

- Use the debug page for contract interaction
- Monitor transaction status on Mode Explorer
- Check agent authorization status before operations
- Verify quest completion before rewards

## Common Issues & Solutions

1. **Agent Can't Fund Tokens**

- Check if agent is authorized
- Verify admin authorization
- Check available balance

2. **Transaction Fails**

- Verify network configuration
- Check role permissions
- Ensure sufficient gas

3. **Quest Validation Issues**

- Check if quest ID exists
- Confirm agent authorization

## Resources

- [Mode Explorer](https://sepolia.explorer.mode.network/)
- [Contract on Mode](https://sepolia.explorer.mode.network/address/0xC259F77B7d010F9D9DE46de1018788ef69620625)

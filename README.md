# Nature Quest 🌿

A decentralized citizen science platform powered by AI and blockchain rewards. Users capture nature discoveries, AI validates them, and contributors earn NTR tokens.

<div align="center" style="margin-bottom: 20px;">

![App Demo GIF](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2RpbzluN2d6NnR6bXBmejZ4b2x3bGZ6bG9yNGpveTg0ZzFldjdqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MbAhUYZBfy6Xjm2Wbg/giphy.gif)

</div>

## Why Nature Quest?

Traditional biodiversity research faces three key challenges:

1. Limited data collection capacity
2. High costs of field research
3. Lack of community engagement

Nature Quest solves these by combining:

- AI-powered species identification
- Gamified citizen science
- Token incentives for quality contributions

## Tech Stack

- **Frontend**: Next.js, RainbowKit
- **Blockchain**: Mode Network, Hardhat
- **AI**: OpenAI GPT-4V for species identification
- **Base Framework**: Built with [ScaffoldETH 2](https://scaffoldeth.io)

## Quick Start

1. **Environment Setup**

```bash
# .env.local
NEXT_PUBLIC_AGENT_ADDRESS=your_agent_address
AGENT_PRIVATE_KEY=your_agent_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC259F77B7d010F9D9DE46de1018788ef69620625
```

2. **Install & Run**

```bash
yarn install
yarn start
```

## System Architecture

### Smart Contract (Mode Testnet)

- **Address**: `0xC259F77B7d010F9D9De46de1018788ef69620625`
- **Token**: NTR (Nature Token)

### Role System

1. **Owner**: Contract deployer, manages admins
2. **Admins**: Authorize/remove agents
3. **Agents**: AI-powered entities that process rewards

### Reward Flow

1. User completes nature quest
2. AI agent validates submission
3. Valid discoveries earn NTR tokens
4. Quest completion recorded on-chain

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

1. **Contract Interaction**

- Use debug page to interact with contract
- Authorize agent and fund with tokens
- Monitor transactions on Mode Explorer

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Resources

- [Mode Explorer](https://sepolia.explorer.mode.network/)
- [Contract](https://sepolia.explorer.mode.network/address/0xC259F77B7d010F9D9De46de1018788ef69620625)

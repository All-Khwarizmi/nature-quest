import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

//! hardcoded for now or local dev
export let AGENT_PRIVATE_KEY =
  process.env.AGENT_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const AGENT_ADR = process.env.AGENT_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; //* the ERC20 contract address
export const CHAIN_ID = 31337;
export const CHAIN = hardhat;
export const RPC_PROVIDER_URL = process.env.RPC_PROVIDER_URL || "http://localhost:8545";

// Parsing the private key and converting it to an account
AGENT_PRIVATE_KEY = AGENT_PRIVATE_KEY.startsWith("0x") ? AGENT_PRIVATE_KEY : `0x${AGENT_PRIVATE_KEY}`;
export const ACCOUNT = privateKeyToAccount(AGENT_PRIVATE_KEY as `0x${string}`);

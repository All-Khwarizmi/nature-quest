import { ACCOUNT, CHAIN, CONTRACT_ADDRESS, RPC_PROVIDER_URL } from "./constants";
import { erc20NTRFactory } from "./erc20-plugin";
import { walletClientFactory } from "./wallet";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PluginBase } from "@goat-sdk/core";
import { EVMWalletClient, sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { http } from "viem";

// Creating the wallet client for the agent
const walletClient = walletClientFactory({
  account: ACCOUNT,
  transport: http(RPC_PROVIDER_URL),
  chain: CHAIN,
});

const NTR = erc20NTRFactory(CONTRACT_ADDRESS as `0x${string}`);

export const TOOLS = await getOnChainTools({
  wallet: viem(walletClient),

  // Adding the SE2Token plugin to the list of plugins
  // The sendETH() plugin is used to send ETH (or other tokens?) to the user's address
  plugins: [
    // Type cast to avoid the TS error but this is the type of the plugin anyway
    sendETH() as unknown as PluginBase<EVMWalletClient>,
    NTR,
  ],
});

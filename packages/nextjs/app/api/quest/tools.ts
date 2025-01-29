import { ACCOUNT, CONTRACT_ADDRESS } from "./constants";
import { erc20PluginFactory } from "./erc20-plugin";
import { walletClientFactory } from "./wallet";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PluginBase } from "@goat-sdk/core";
import { EVMWalletClient, sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { http } from "viem";
import { hardhat } from "viem/chains";

// Creating the wallet client for the agent
const walletClient = walletClientFactory({
  account: ACCOUNT,
  transport: http(process.env.RPC_PROVIDER_URL),
  chain: hardhat,
});

// Creating the SE2Token plugin for the agent
const SE2 = erc20PluginFactory(CONTRACT_ADDRESS as `0x${string}`);

export const TOOLS = await getOnChainTools({
  wallet: viem(walletClient),

  // Adding the SE2Token plugin to the list of plugins
  // The sendETH() plugin is used to send ETH (or other tokens?) to the user's address
  plugins: [
    // Type cast to avoid the TS error but this is the type of the plugin anyway
    sendETH() as unknown as PluginBase<EVMWalletClient>,
    SE2,
  ],
});

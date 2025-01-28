import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PluginBase } from "@goat-sdk/core";
import { erc20 } from "@goat-sdk/plugin-erc20";
import { EVMWalletClient, sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { generateText } from "ai";
import { Account, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

// Quest Check Module
export async function POST(req: NextRequest) {
  //~ Check step
  const { userAddress } = await req.json();
  // TODO:
  // pass the classification json (string), user address (evm/mode), user "upload" (from src/db/schema) id
  // iterate over the quests
  // check if any of the quests match the classification
  // if yes, call the reward agent
  //? otherwise, use the user "upload" id to update the resource in db: status = rejected

  console.log();

  //~ Reward Agent

  //! hardcoded for now or local dev
  let AGENT_PRIVATE_KEY =
    process.env.AGENT_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const AGENT_ADR = process.env.AGENT_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; //* the ERC20 contract address

  if (!AGENT_PRIVATE_KEY || !AGENT_ADR || !CONTRACT_ADDRESS) {
    return Response.json({ error: "Missing environment variables" }, { status: 500 });
  }

  // Parsing the private key and converting it to an account
  AGENT_PRIVATE_KEY = AGENT_PRIVATE_KEY.startsWith("0x") ? AGENT_PRIVATE_KEY : `0x${AGENT_PRIVATE_KEY}`;
  const account = privateKeyToAccount(AGENT_PRIVATE_KEY as `0x${string}`);

  // Creating the wallet client for the agent
  const walletClient = createWalletClient({
    account: account as Account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: hardhat,
  });

  // Creating the SE2Token plugin for the agent
  const SE2 = erc20({
    tokens: [
      {
        decimals: 18,
        symbol: "SE2",
        name: "SE2Token",
        chains: {
          "31337": {
            contractAddress: CONTRACT_ADDRESS as `0x${string}`,
          },
        },
      },
    ],
  });

  const tools = await getOnChainTools({
    wallet: viem(walletClient),

    // Adding the SE2Token plugin to the list of plugins
    // The sendETH() plugin is used to send ETH (or other tokens?) to the user's address
    plugins: [
      // Type cast to avoid the TS error but this is the type of the plugin anyway
      sendETH() as unknown as PluginBase<EVMWalletClient>,
      SE2,
    ],
  });

  //? We need to make sure that the user has enough SE2 to transfer or the agent should take care of it?
  const AMOUNT = 0.01;
  const USER_ADR = userAddress || "0xdd916e48C047e78392B1129c9784d807C1D25B54"; // TODO: get the user address from the request body
  const templatePrompt = `Transfer ${AMOUNT} of SE2 to ${USER_ADR}`; // TODO: fine tune the prompt

  try {
    const result = await generateText({
      //? This is the model we want to use?
      model: openai("gpt-4o-mini"),
      tools: tools,
      //? How many steps should the agent take?
      maxSteps: 15,
      prompt: templatePrompt,
      onStepFinish: event => {
        // TODO: Handle the tool results and call next steps
        console.log(event.toolResults);
      },
    });
    console.log(result.text);
    return Response.json({ result: result.text });
  } catch (error) {
    console.error(error);
    return Response.json({ error });
  }
}

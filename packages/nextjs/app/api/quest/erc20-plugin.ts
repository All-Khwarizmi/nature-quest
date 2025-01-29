import { erc20 } from "@goat-sdk/plugin-erc20";

export function erc20PluginFactory(contractAddress: string) {
  return erc20({
    tokens: [
      {
        decimals: 18,
        symbol: "SE2",
        name: "SE2Token",
        chains: {
          "31337": {
            contractAddress: contractAddress as `0x${string}`,
          },
        },
      },
    ],
  });
}

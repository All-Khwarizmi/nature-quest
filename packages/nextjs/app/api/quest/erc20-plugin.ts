import { CHAIN_ID } from "./constants";
import { erc20 } from "@goat-sdk/plugin-erc20";

export function erc20NTRFactory(contractAddress: string) {
  return erc20({
    tokens: [
      {
        decimals: 18,
        symbol: "NTR",
        name: "NatureQuestToken",
        chains: {
          [CHAIN_ID]: {
            contractAddress: contractAddress as `0x${string}`,
          },
        },
      },
    ],
  });
}

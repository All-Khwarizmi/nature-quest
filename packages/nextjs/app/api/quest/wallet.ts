import { Account, Chain, Transport, createWalletClient } from "viem";

// Creating the wallet client for the agent
export function walletClientFactory({
  account,
  transport,
  chain,
}: {
  account: Account;
  transport: Transport;
  chain: Chain;
}) {
  return createWalletClient({
    account,
    transport,
    chain,
  });
}

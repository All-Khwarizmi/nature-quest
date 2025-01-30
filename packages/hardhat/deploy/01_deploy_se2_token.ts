import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { vars } from "hardhat/config";
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNTRToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */

  const deployer = vars.get("DEPLOYER_ADDRESS");

  const initialAdmin = vars.get("INITIAL_ADMIN_ADDRESS");
  if (!initialAdmin) throw new Error("Missing INITIAL_ADMIN_ADDRESS");
  const { deploy } = hre.deployments;

  await deploy("NatureToken", {
    from: deployer,
    log: true,
    args: [initialAdmin],
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  // Log deployment info
  const token = await hre.ethers.getContract<Contract>("NatureToken", initialAdmin);
  console.log("Transaction Hash:", token.deployTransaction);

  const contractAddress = await token.getAddress();
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Network: Mode Testnet");
  console.log("Initial Admin:", initialAdmin);
  console.log("NatureToken deployed to:", contractAddress);
};

export default deployNTRToken;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags SE2Token
deployNTRToken.tags = ["NTRToken"];

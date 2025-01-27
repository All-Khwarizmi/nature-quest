import { expect } from "chai";
import hre from "hardhat";

describe("NatureToken", function () {
  it("Should deploy without errors", async function () {
    const [owner] = await hre.ethers.getSigners();

    const NatureToken = await hre.ethers.getContractFactory("NatureToken");

    await NatureToken.deploy(owner);
  });

  it("Should assign the authorized minter", async function () {
    const [_, minter] = await hre.ethers.getSigners();

    const NatureToken = await hre.ethers.getContractFactory("NatureToken");

    const token = await NatureToken.deploy(minter);

    expect(await token.authorizedMinter()).to.equal(minter.address);
  });
});

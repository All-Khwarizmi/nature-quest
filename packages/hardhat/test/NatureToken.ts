// test/NatureToken/basic.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { NatureToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("NatureToken", function () {
  // Contracts
  let natureToken: NatureToken;

  // Signers
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let agent: SignerWithAddress;
  let user: SignerWithAddress;
  let unauthorized: SignerWithAddress;

  beforeEach(async () => {
    [owner, admin, agent, user, unauthorized] = await ethers.getSigners();

    // Deploy contract
    const NatureToken = await ethers.getContractFactory("NatureToken");
    natureToken = await NatureToken.deploy(admin.address);
  });

  describe("Feature: Initial Setup", () => {
    it("should initialize with correct token details", async () => {
      expect(await natureToken.name()).to.equal("NATURE");
      expect(await natureToken.symbol()).to.equal("NTR");
    });

    it("should set initial admin correctly", async () => {
      expect(await natureToken.isAdmin(admin.address)).to.be.true;
    });
  });

  describe("Feature: Admin Management", () => {
    describe("when adding new admin", () => {
      it("should allow owner to add admin", async () => {
        await expect(natureToken.addAdmin(unauthorized.address))
          .to.emit(natureToken, "AdminAdded")
          .withArgs(unauthorized.address);

        expect(await natureToken.isAdmin(unauthorized.address)).to.be.true;
      });

      it("should prevent non-owner from adding admin", async () => {
        await expect(natureToken.connect(unauthorized).addAdmin(unauthorized.address)).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
      });

      it("should prevent adding zero address as admin", async () => {
        await expect(natureToken.addAdmin(ethers.ZeroAddress)).to.be.revertedWith("NatureToken: invalid admin address");
      });

      it("should prevent adding existing admin", async () => {
        await natureToken.addAdmin(unauthorized.address);
        await expect(natureToken.addAdmin(unauthorized.address)).to.be.revertedWith("NatureToken: already admin");
      });
    });

    describe("when removing admin", () => {
      beforeEach(async () => {
        await natureToken.addAdmin(unauthorized.address);
      });

      it("should allow owner to remove admin", async () => {
        await expect(natureToken.removeAdmin(unauthorized.address))
          .to.emit(natureToken, "AdminRemoved")
          .withArgs(unauthorized.address);

        expect(await natureToken.isAdmin(unauthorized.address)).to.be.false;
      });

      it("should prevent non-owner from removing admin", async () => {
        await expect(natureToken.connect(unauthorized).removeAdmin(admin.address)).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
      });

      it("should prevent removing non-existent admin", async () => {
        await expect(natureToken.removeAdmin(user.address)).to.be.revertedWith("NatureToken: not admin");
      });
    });
  });

  describe("Feature: Agent Management", () => {
    describe("when authorizing agent", () => {
      it("should allow admin to authorize agent", async () => {
        await expect(natureToken.connect(admin).authorizeAgent(agent.address))
          .to.emit(natureToken, "AgentAuthorized")
          .withArgs(agent.address, admin.address);

        expect(await natureToken.isAgent(agent.address)).to.be.true;
      });

      it("should prevent non-admin from authorizing agent", async () => {
        await expect(natureToken.connect(unauthorized).authorizeAgent(agent.address)).to.be.revertedWith(
          "NatureToken: caller is not admin",
        );
      });
    });

    describe("when removing agent", () => {
      beforeEach(async () => {
        await natureToken.connect(admin).authorizeAgent(agent.address);
      });

      it("should allow admin to remove agent", async () => {
        await expect(natureToken.connect(admin).removeAgent(agent.address))
          .to.emit(natureToken, "AgentRemoved")
          .withArgs(agent.address, admin.address);

        expect(await natureToken.isAgent(agent.address)).to.be.false;
      });

      it("should prevent non-admin from removing agent", async () => {
        await expect(natureToken.connect(unauthorized).removeAgent(agent.address)).to.be.revertedWith(
          "NatureToken: caller is not admin",
        );
      });
    });
  });

  describe("Feature: Quest Rewards", () => {
    const QUEST_ID = "quest-123";
    const REWARD_AMOUNT = ethers.parseEther("100");

    beforeEach(async () => {
      await natureToken.connect(admin).authorizeAgent(agent.address);
    });

    describe("when minting quest rewards", () => {
      it("should allow agent to mint rewards", async () => {
        await expect(natureToken.connect(agent).mintQuestReward(REWARD_AMOUNT, user.address, QUEST_ID))
          .to.emit(natureToken, "QuestRewardMinted")
          .withArgs(user.address, REWARD_AMOUNT, QUEST_ID, agent.address);

        expect(await natureToken.balanceOf(user.address)).to.equal(REWARD_AMOUNT);
      });

      it("should prevent non-agent from minting rewards", async () => {
        await expect(
          natureToken.connect(unauthorized).mintQuestReward(REWARD_AMOUNT, user.address, QUEST_ID),
        ).to.be.revertedWith("NatureToken: caller is not agent");
      });

      it("should prevent double processing of same quest", async () => {
        await natureToken.connect(agent).mintQuestReward(REWARD_AMOUNT, user.address, QUEST_ID);

        await expect(
          natureToken.connect(agent).mintQuestReward(REWARD_AMOUNT, user.address, QUEST_ID),
        ).to.be.revertedWith("NatureToken: quest already processed");
      });

      it("should prevent minting to zero address", async () => {
        await expect(
          natureToken.connect(agent).mintQuestReward(REWARD_AMOUNT, ethers.ZeroAddress, QUEST_ID),
        ).to.be.revertedWith("NatureToken: invalid recipient");
      });

      it("should prevent minting zero amount", async () => {
        await expect(natureToken.connect(agent).mintQuestReward(0, user.address, QUEST_ID)).to.be.revertedWith(
          "NatureToken: invalid amount",
        );
      });
    });
  });
});

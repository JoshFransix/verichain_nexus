import { expect } from "chai";
import { ethers } from "hardhat";
import { AgentRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AgentRegistry", function () {
  let registry: AgentRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    registry = await AgentRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Agent Registration", function () {
    it("registers new agent", async function () {
      const tx = await registry.registerAgent(
        "GPT Agent",
        "AI assistant",
        "https://api.example.com/gpt",
        ["chat", "analysis"]
      );

      await expect(tx)
        .to.emit(registry, "AgentRegistered")
        .withArgs(0, "GPT Agent", owner.address);

      const agent = await registry.getAgentById(0);
      expect(agent.name).to.equal("GPT Agent");
      expect(agent.description).to.equal("AI assistant");
      expect(agent.endpoint).to.equal("https://api.example.com/gpt");
      expect(agent.capabilities).to.deep.equal(["chat", "analysis"]);
      expect(agent.owner).to.equal(owner.address);
      expect(agent.isActive).to.be.true;
    });

    it("reverts if name empty", async function () {
      await expect(
        registry.registerAgent("", "Description", "https://api.example.com", ["chat"])
      ).to.be.revertedWithCustomError(registry, "EmptyName");
    });

    it("reverts if endpoint empty", async function () {
      await expect(
        registry.registerAgent("Agent", "Description", "", ["chat"])
      ).to.be.revertedWithCustomError(registry, "EmptyEndpoint");
    });

    it("auto-increments IDs", async function () {
      await registry.registerAgent("Agent 1", "First", "https://api1.com", ["chat"]);
      await registry.registerAgent("Agent 2", "Second", "https://api2.com", ["analysis"]);

      const agent1 = await registry.getAgentById(0);
      const agent2 = await registry.getAgentById(1);

      expect(agent1.id).to.equal(0);
      expect(agent2.id).to.equal(1);
    });
  });

  describe("Agent Updates", function () {
    beforeEach(async function () {
      await registry.registerAgent(
        "Original Name",
        "Original Description",
        "https://original.com",
        ["capability1"]
      );
    });

    it("owner can update agent", async function () {
      await registry.updateAgent(
        0,
        "Updated Name",
        "Updated Description",
        "https://updated.com",
        ["capability1", "capability2"]
      );

      const agent = await registry.getAgentById(0);
      expect(agent.name).to.equal("Updated Name");
      expect(agent.description).to.equal("Updated Description");
      expect(agent.endpoint).to.equal("https://updated.com");
      expect(agent.capabilities).to.deep.equal(["capability1", "capability2"]);
    });

    it("non-owner cannot update", async function () {
      await expect(
        registry.connect(user1).updateAgent(
          0,
          "Hacked Name",
          "Hacked",
          "https://hacked.com",
          ["hack"]
        )
      ).to.be.revertedWithCustomError(registry, "Unauthorized");
    });

    it("cannot update inactive agent", async function () {
      await registry.deactivateAgent(0);

      await expect(
        registry.updateAgent(
          0,
          "Updated",
          "Updated",
          "https://updated.com",
          ["updated"]
        )
      ).to.be.revertedWithCustomError(registry, "AgentInactive");
    });
  });

  describe("Agent Deactivation", function () {
    beforeEach(async function () {
      await registry.registerAgent("Agent", "Description", "https://api.com", ["chat"]);
    });

    it("owner can deactivate agent", async function () {
      await expect(registry.deactivateAgent(0))
        .to.emit(registry, "AgentDeactivated")
        .withArgs(0);

      const agent = await registry.getAgentById(0);
      expect(agent.isActive).to.be.false;
    });

    it("non-owner cannot deactivate", async function () {
      await expect(
        registry.connect(user1).deactivateAgent(0)
      ).to.be.revertedWithCustomError(registry, "Unauthorized");
    });

    it("cannot deactivate inactive agent", async function () {
      await registry.deactivateAgent(0);

      await expect(
        registry.deactivateAgent(0)
      ).to.be.revertedWithCustomError(registry, "AgentInactive");
    });
  });

  describe("Agent Retrieval", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerAgent(
        "Agent 1",
        "First agent",
        "https://api1.com",
        ["chat"]
      );
      await registry.connect(user2).registerAgent(
        "Agent 2",
        "Second agent",
        "https://api2.com",
        ["analysis"]
      );
      await registry.connect(user1).registerAgent(
        "Agent 3",
        "Third agent",
        "https://api3.com",
        ["vision"]
      );
    });

    it("gets agent by ID", async function () {
      const agent = await registry.getAgentById(1);
      expect(agent.name).to.equal("Agent 2");
      expect(agent.owner).to.equal(user2.address);
    });

    it("reverts for non-existent agent", async function () {
      await expect(
        registry.getAgentById(999)
      ).to.be.revertedWithCustomError(registry, "AgentNotFound");
    });

    it("gets all agents", async function () {
      const agents = await registry.getAllAgents();
      expect(agents.length).to.equal(3);
      expect(agents[0].name).to.equal("Agent 1");
      expect(agents[1].name).to.equal("Agent 2");
      expect(agents[2].name).to.equal("Agent 3");
    });

    it("gets active agents only", async function () {
      await registry.connect(user1).deactivateAgent(0);

      const activeAgents = await registry.getActiveAgents();
      expect(activeAgents.length).to.equal(2);
      expect(activeAgents[0].name).to.equal("Agent 2");
      expect(activeAgents[1].name).to.equal("Agent 3");
    });

    it("gets agents by owner", async function () {
      const user1Agents = await registry.getAgentsByOwner(user1.address);
      expect(user1Agents.length).to.equal(2);
      expect(user1Agents[0].name).to.equal("Agent 1");
      expect(user1Agents[1].name).to.equal("Agent 3");

      const user2Agents = await registry.getAgentsByOwner(user2.address);
      expect(user2Agents.length).to.equal(1);
      expect(user2Agents[0].name).to.equal("Agent 2");
    });

    it("gets total count", async function () {
      const total = await registry.getTotalAgents();
      expect(total).to.equal(3);
    });
  });

  describe("Multiple Operations", function () {
    it("handles multiple operations", async function () {
      await registry.connect(user1).registerAgent("Agent A", "A", "https://a.com", ["a"]);
      await registry.connect(user2).registerAgent("Agent B", "B", "https://b.com", ["b"]);
      await registry.connect(user1).registerAgent("Agent C", "C", "https://c.com", ["c"]);

      await registry.connect(user1).updateAgent(0, "Updated A", "Updated", "https://a2.com", ["a", "updated"]);
      await registry.connect(user1).deactivateAgent(2);

      const allAgents = await registry.getAllAgents();
      const activeAgents = await registry.getActiveAgents();
      const user1Agents = await registry.getAgentsByOwner(user1.address);

      expect(allAgents.length).to.equal(3);
      expect(activeAgents.length).to.equal(2);
      expect(user1Agents.length).to.equal(2);

      expect(allAgents[0].name).to.equal("Updated A");
      expect(allAgents[2].isActive).to.be.false;
    });
  });
});

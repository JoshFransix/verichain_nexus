import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying on network: ${network.name}`);
  console.log(`Deployer address: ${deployer.address}`);

  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`AgentRegistry deployed to: ${address}`);
  console.log(`\nAdd to your frontend .env:\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

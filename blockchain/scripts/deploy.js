const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying PortfolioProjectRegistry to:", hre.network.name);
  console.log("----------------------------------------------------");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const PortfolioProjectRegistry = await hre.ethers.getContractFactory("PortfolioProjectRegistry");
  const registry = await PortfolioProjectRegistry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  const txHash = registry.deploymentTransaction()?.hash || "";
  console.log("PortfolioProjectRegistry deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Deployment Tx Hash:", txHash);

  // Read ABI from artifacts
  const artifactPath = path.join(__dirname, "../artifacts/contracts/PortfolioProjectRegistry.sol/PortfolioProjectRegistry.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const exportData = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    address: contractAddress,
    deploymentTxHash: txHash,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    explorerUrl: hre.network.name === "sepolia" 
      ? `https://sepolia.etherscan.io/address/${contractAddress}` 
      : `http://localhost:8545`,
    abi: abi
  };

  // Save to blockchain folder
  const localDest = path.join(__dirname, "../deployed-contract.json");
  fs.writeFileSync(localDest, JSON.stringify(exportData, null, 2));

  // Sync to backend
  const backendDest = path.join(__dirname, "../../backend/config/contractConfig.json");
  fs.mkdirSync(path.dirname(backendDest), { recursive: true });
  fs.writeFileSync(backendDest, JSON.stringify(exportData, null, 2));

  // Sync to frontend
  const frontendDest = path.join(__dirname, "../../frontend/src/services/contractConfig.json");
  fs.mkdirSync(path.dirname(frontendDest), { recursive: true });
  fs.writeFileSync(frontendDest, JSON.stringify(exportData, null, 2));

  console.log("Contract configuration synchronized across blockchain, backend, and frontend!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});

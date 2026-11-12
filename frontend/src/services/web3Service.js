import { ethers } from "ethers";

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111 in hex

export async function connectWeb3Wallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask or Web3 wallet extension not detected. Please install MetaMask to interact directly on-chain.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found");
  }

  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  return {
    address: accounts[0],
    chainId,
    isSepolia: chainId === SEPOLIA_CHAIN_ID_HEX,
  };
}

export async function switchToSepolia() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (switchError) {
    // 4902 means network has not been added to MetaMask
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID_HEX,
            chainName: "Sepolia Test Network",
            nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    }
  }
}

export function shortenAddress(address) {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Computes canonical SHA-256 hash in browser matching backend hashUtil
 */
export async function computeClientProjectHash(project) {
  const normalized = {
    projectId: (project.projectId || "").trim().toLowerCase(),
    title: (project.title || "").trim(),
    description: (project.description || "").trim(),
    version: (project.version || "1.0.0").trim(),
    technologies: Array.isArray(project.technologies)
      ? [...project.technologies].map((t) => t.trim().toLowerCase()).sort()
      : [],
    githubUrl: (project.githubUrl || "").trim(),
  };

  const canonicalString = JSON.stringify(normalized);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalString);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return {
    canonicalString,
    hashHex,
    bytes32: "0x" + hashHex,
  };
}

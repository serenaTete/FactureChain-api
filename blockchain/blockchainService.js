import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🌐 PROVIDER (réseau blockchain)
 */
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

/**
 * 🔐 WALLET (compte signataire)
 */
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

/**
 * 📜 SMART CONTRACT ABI (unifié)
 * Consommation + Facture + Réclamation + Anomalie
 */
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  [
    // 🔵 CONSOMMATION
    "function storeConsumptionHash(bytes32 id, string hash)",

    // 🟢 FACTURE
    "function storeFactureHash(bytes32 id, string hash)",

    // 🟡 RÉCLAMATION
    "function storeReclamationHash(bytes32 id, string hash)",

    // 🔍 LECTURE FACTURE
    "function getFactureHash(bytes32 id) view returns (string)",

    // 🔍 LECTURE RÉCLAMATION
    "function getReclamationHash(bytes32 id) view returns (string)"
  ],
  wallet
);

/**
 * 🔐 STORE CONSOMMATION
 */
export const storeConsumptionHash = async (idBytes32, hash) => {
  try {
    const tx = await contract.storeConsumptionHash(idBytes32, hash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Blockchain consommation error:", error);
    throw error;
  }
};

/**
 * 🧾 STORE FACTURE
 */
export const storeFactureHash = async (idBytes32, hash) => {
  try {
    const tx = await contract.storeFactureHash(idBytes32, hash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Blockchain facture error:", error);
    throw error;
  }
};

/**
 * 📢 STORE RÉCLAMATION
 */
export const storeReclamationHash = async (idBytes32, hash) => {
  try {
    const tx = await contract.storeReclamationHash(idBytes32, hash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Blockchain reclamation error:", error);
    throw error;
  }
};

/**
 * 🔍 VERIFY FACTURE
 */
export const getFactureHash = async (idBytes32) => {
  try {
    return await contract.getFactureHash(idBytes32);
  } catch (error) {
    console.error("❌ Get facture hash error:", error);
    throw error;
  }
};

/**
 * 🔍 VERIFY RÉCLAMATION
 */
export const getReclamationHash = async (idBytes32) => {
  try {
    return await contract.getReclamationHash(idBytes32);
  } catch (error) {
    console.error("❌ Get reclamation hash error:", error);
    throw error;
  }
};

export default contract;
// services/blockchain.service.js

import { ethers } from "ethers";
import ABI from "../config/abi.json" assert { type: "json" };

// =====================
// CONFIGURATION BLOCKCHAIN
// =====================

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  signer
);

// =====================
// AUTH / ROLES
// =====================

export const getRole = async (address) => {
  return await contract.getRole(address);
};

export const assignRole = async (address, role) => {
  const tx = await contract.assignRole(address, role);
  return await tx.wait();
};

export const isAdmin = async (address) => {
  const role = await contract.getRole(address);
  return Number(role) === 3;
};

// version sécurisée
export const secureAssignRole = async (caller, target, role) => {
  const admin = await isAdmin(caller);

  if (!admin) {
    throw new Error("Not authorized");
  }

  return await assignRole(target, role);
};

// =====================
// CONSOMMATION
// =====================

export const recordConsumption = async (meterId, hash, timestamp) => {
  const tx = await contract.recordConsumption(user, hash, timestamp);
  return await tx.wait();
};

export const getConsumptionHistory = async (user) => {
  return await contract.getConsumption(user);
};

export const storeConsumptionHash = async (consumptionId, hash) => {
  const tx = await contract.storeConsumptionHash(consumptionId, hash);
  return await tx.wait();
};

// =====================
// FACTURES
// =====================

export const generateInvoice = async (user, amount, period) => {
  const tx = await contract.generateInvoice(user, amount, period);
  return await tx.wait();
};

export const getInvoices = async (user) => {
  return await contract.getInvoices(user);
};

export const storeFactureHash = async (factureId, hash) => {
  const tx = await contract.storeFactureHash(factureId, hash);
  return await tx.wait();
};

export const verifyFactureHash = async (factureId) => {
  return await contract.getFactureHash(factureId);
};

// =====================
// RECLAMATIONS
// =====================

export const submitClaim = async (user, description) => {
  const tx = await contract.submitClaim(user, description);
  return await tx.wait();
};

export const processClaim = async (claimId, status) => {
  const tx = await contract.processClaim(claimId, status);
  return await tx.wait();
};

export const getClaims = async (user) => {
  return await contract.getClaims(user);
};

export const storeClaimHash = async (claimId, hash) => {
  const tx = await contract.storeClaimHash(claimId, hash);
  return await tx.wait();
};

// =====================
// ANOMALIES / ALERTES
// =====================

export const reportAnomaly = async (userAddress, hash, relatedHash, severity, timestamp) => {
    try{
  const tx = await contract.reportAnomaly(userAddress, hash, relatedHash, severity, timestamp);
  return await tx.wait();
    } catch(error){
        console.error("storeAnomaly", error.message);
        throw error;
    }
};

export const getAnomalies = async (user) => {
  return await contract.getAnomalies(user);
};

export const storeAnomalyHash = async (anomalyId, hash) => {
  const tx = await contract.storeAnomalyHash(anomalyId, hash);
  return await tx.wait();
};

// =====================
// UTILITAIRES
// =====================

export const getOwner = async () => {
  return await contract.owner();
};

export const getContract = () => contract;

export const getProvider = () => provider;
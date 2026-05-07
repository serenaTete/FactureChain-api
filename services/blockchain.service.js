// services/blockchain.service.js

import { ethers } from "ethers";
import {createRequire} from "module";
import {hashData} from "../utils/hash.js";
// =====================
// CONFIGURATION BLOCKCHAIN
// =====================
const require = createRequire(import.meta.url);

const ABI = require("../config/abi.json");

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

/* export const getRole = async (address) => {
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
}; */

// =====================
// CONSOMMATION
// =====================

export const recordConsumption = async (meterId, value, timestamp) => {
  const hash = hashData(meterId, value, timestamp);
  const tx = await contract.recordConsumption(meterId, value, timestamp);
  receipt= await tx.wait();
  return {
    hash,
    txHash: tx.hash
  };
};


export const storeConsumptionHash = async (consumptionId, hash) => {
  const tx = await contract.storeConsumptionHash(consumptionId, hash);
  return await tx.wait();
};

// =====================
// FACTURES
// =====================

export const generateInvoice = async (meterId, month, year, totalKwh, montant) => {
  const hash = hashData(meterId, month, year, totalKwh, montant);
  const tx = await contract.generateInvoice(meterId, month, year, totalKwh, montant);
  receipt= await tx.wait();
  return {
    hash,
    txHash: tx.hash
  };
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

export const submitClaim = async (data) => {
  const hash = hashData(data);
  const tx = await contract.submitClaim(data);
   const receipt= await tx.wait();
  return {
    hash,
    txHash: tx.hash
  };
};

export const processClaim = async (claimId) => {
  const tx = await contract.processClaim(claimId, status);
  return await tx.wait();
};
export const resolveClaim = async (claimId, data) => {
  const finalHash = hashData(data);
  const tx = await contract.resolveClaim(claimId, finalHash);
  receipt= await tx.wait();
  return {
   finalHash
  };
};
export const rejectClaim = async (claimId, data) => {
  const finalHash = hashData(data)
  const tx = await contract.processClaim(claimId, finalHash);
  receipt= await tx.wait();
  return {
    finalHash
  };
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

export const reportAnomaly = async ( consommationId, type, description, date) => {
    try{
      const hash = hashData(consommationId, type, description, date);
  const tx = await contract.reportAnomaly( consommationId, type, description, date);
  receipt= await tx.wait();
  return {
    hash,
    txHash: tx.hash
  };
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
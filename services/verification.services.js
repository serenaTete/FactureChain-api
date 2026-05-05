import contract from "./blockchain.service.js";
import { uuidToBytes32 } from "../utils/hash.js";
import crypto from "crypto";

const hashData = (data) =>
  crypto.createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

/**
 * Vérifier facture via QR + blockchain
 */
export const verify = async ({ id, factureData }) => {

  const localHash = hashData(factureData);

  const idBytes = uuidToBytes32(id);

  const chainHash = await contract.verifyFactureHash(idBytes);

  return {
    valid: localHash === chainHash,
    message: localHash === chainHash
      ? "Facture authentique"
      : "Facture modifiée"
  };
};
import prisma from "../utils/prisma.js";
import contract from "./blockchain.service.js";
import { hashData, uuidToBytes32 } from "../utils/hash.js";
import { regenerateFacture } from "./facture.regenerate.service.js";

export const createReclamation = async (userId, message, factureId) => {

  const reclamation = await prisma.report.create({
    data: { userId, message, factureId }
  });

  const hash = hashData(reclamation);

  const idBytes = uuidToBytes32(reclamation.id);
  await contract.storeReclamationHash(idBytes, hash);

  return prisma.report.update({
    where: { id: reclamation.id },
    data: { hash }
  });

};


export const createReclamation = async (userId, message, factureId = null) => {

  const reclamation = await prisma.report.create({
    data: { userId, message, factureId }
  });

  // hash
  const hash = hashData(reclamation);

  // blockchain
  const idBytes = uuidToBytes32(reclamation.id);

  await contract.storeReclamationHash(idBytes, hash);

  // update DB
  return prisma.report.update({
    where: { id: reclamation.id },
    data: { hash }
  });
};


 */
export const getUserReclamations = (userId) => {
  return prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

/**
 * 🔎 détail réclamation
 */
export const getReclamationById = (id) => {
  return prisma.report.findUnique({
    where: { id }
  });
};


export const processReclamation = async (
  id,
  status,
  resolution,
  factureId = null,
  newAmount = null
) => {

  const reclamation = await prisma.report.update({
    where: { id },
    data: { status, resolution }
  });

  let newFacture = null;

  // si correction demandée
  if (status === "RESOLUE" && factureId && newAmount) {
    newFacture = await regenerateFacture(factureId, newAmount);
  }

  return {
    reclamation,
    newFacture
  };
};
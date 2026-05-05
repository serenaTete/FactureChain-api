import prisma from "../utils/prisma.js";
import QRCode from "qrcode";
import contract from "./blockchain.service.js";
import { hashData, uuidToBytes32 } from "../utils/hash.js";

export const regenerateFacture = async (factureId, newAmount) => {

  const old = await prisma.facture.update({
    where: { id: factureId },
    data: { isActive: false }
  });

  const newFacture = await prisma.facture.create({
    data: {
      userId: old.userId,
      consommationId: old.consommationId,
      montant: newAmount,
      version: old.version + 1
    }
  });

  const hash = hashData(newFacture);

  const idBytes = uuidToBytes32(newFacture.id);
  await contract.storeFactureHash(idBytes, hash);

  const qrCode = await QRCode.toDataURL(
    JSON.stringify({
      id: newFacture.id,
      version: newFacture.version,
      hash
    })
  );

  return prisma.facture.update({
    where: { id: newFacture.id },
    data: { hash, qrCode }
  });
};
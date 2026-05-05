import prisma from "../utils/prisma.js";
import QRCode from "qrcode";
import contract from "./blockchain.service.js";
import { hashData, uuidToBytes32 } from "../utils/hash.js";

/**
 * DETECTION ANOMALIES
 */
const detectAnomalies = (value, montant) => {
  let anomalies = [];

  if (value > 1000) {
    anomalies.push("SURCONSOMMATION");
  }

  if (montant > value * 120) {
    anomalies.push("INCOHERENCE_FACTURE");
  }

  return anomalies;
};

/**
 * GENERATION FACTURE (cron ou manuel)
 */
export const generateFacture = async (consommation) => {

  const montant = consommation.value * 100;

  const facture = await prisma.facture.create({
    data: {
      userId: consommation.userId,
      consommationId: consommation.id,
      montant
    }
  });

  // anomalies
  const anomalies = detectAnomalies(consommation.value, montant);

  for (const a of anomalies) {
    await prisma.anomalie.create({
      data: {
        userId: consommation.userId,
        type: a,
        severity: "HIGH"
      }
    });

    await prisma.alerte.create({
      data: {
        userId: consommation.userId,
        message: `Anomalie: ${a}`
      }
    });
  }

  // hash
  const hash = hashData(facture);

  // blockchain
  const idBytes = uuidToBytes32(facture.id);
  await contract.storeFactureHash(idBytes, hash);

  // QR
  const qrCode = await QRCode.toDataURL(
    JSON.stringify({ id: facture.id, hash })
  );

  return prisma.facture.update({
    where: { id: facture.id },
    data: { hash, qrCode }
  });
};
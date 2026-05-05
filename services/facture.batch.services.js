import prisma from "../utils/prisma.js";
import QRCode from "qrcode";
import crypto from "crypto";
import contract from "./blockchain.service.js";
import { uuidToBytes32 } from "../utils/hash.js";

/**
 * HASH
 */
const hashData = (data) =>
  crypto.createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

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
 * GENERATION MENSUELLE
 */
export const generateMonthlyBills = async () => {

  // 1. récupérer tous les users
  const users = await prisma.user.findMany();

  for (const user of users) {

    // 2. consommation du mois
    const consommations = await prisma.consommation.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().setDate(1)) // début mois
        }
      }
    });

    const total = consommations.reduce((a, c) => a + c.value, 0);
    const montant = total * 100;

    // 3. facture
    const facture = await prisma.facture.create({
      data: {
        userId: user.id,
        consommationId: consommations[0]?.id,
        montant
      }
    });

    // 4. anomalies
    const anomalies = detectAnomalies(total, montant);

    for (const a of anomalies) {
      await prisma.anomalie.create({
        data: {
          userId: user.id,
          type: a,
          severity: "HIGH"
        }
      });

      await prisma.alerte.create({
        data: {
          userId: user.id,
          message: `Anomalie détectée: ${a}`
        }
      });
    }

    // 5. hash
    const hash = hashData(facture);

    // 6. blockchain
    const idBytes = uuidToBytes32(facture.id);
    await contract.storeFactureHash(idBytes, hash);

    // 7. QR
    const qrCode = await QRCode.toDataURL(
      JSON.stringify({ id: facture.id, hash })
    );

    // 8. update facture
    await prisma.facture.update({
      where: { id: facture.id },
      data: { hash, qrCode }
    });

    console.log(`✔ Facture générée pour ${user.id}`);
  }
};
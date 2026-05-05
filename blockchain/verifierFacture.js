import crypto from "crypto";
import prisma from "../utils/prisma.js";

export const verifierFacture = async (req, res) => {
  const facture = await prisma.facture.findUnique({
    where: { id: req.params.id }
  });

  const hashLocal = crypto
    .createHash("sha256")
    .update(JSON.stringify(facture))
    .digest("hex");

  const valide = hashLocal === facture.hash;

  res.json({
    factureId: facture.id,
    valide
  });
};
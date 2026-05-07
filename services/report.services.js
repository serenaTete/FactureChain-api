import prisma from "../utils/prisma.js";
import {submitClaim, storeClaimHash} from "./blockchain.service.js";
import { hashData, uuidToBytes32 } from "../utils/hash.js";
import { generateMonthlyBills} from "./facture.batch.services.js";
import {createAlert} from "./alerte.services.js";

export const createReclamation = async (data) => {

  const reclamation = await prisma.Report.create({
    data
  });

  await createAlert({

    meterId: data.meterId,
    type: "COMPLAINT",
    message: "Nouvelle réclamation créée",
    severity: "MEDIUM"
  })

  const chain = submitClaim(data);
  

  const idBytes = uuidToBytes32(reclamation.id);
  await contract.storeClaimHash(idBytes, chain.hash);

  return prisma.Report.update({
    where: { id: reclamation.id },
    data: { hash: chain.hash,
            txhash: chain.txHash
     }
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


export const processReclamation = async (complaintId, action) => {


 const reclamation = await prisma.Report.findUnique({

  where: {id: complaintId}
 });

 if(!reclamation) throw new Error("Réclamation introuvable");

 let status = "RESOLVED";
 let response = "";

 if (action === "REGENERATE_BILL" &&  reclamation.billId){
  const bill = await prisma.Facture.findUnique({
    where: { id: reclamation.billId}
  });

  await generateMonthlyBills(

    bill.meterId,
    bill.year,
    bill.month

  );

  response = "Facture corrigée et regénérée";


 }

 elseif( action === "RESOLVE"){

  response = "Réclamation traitée";
 }

 elseif(action === "REJECT"){

  status = "REJECTED";
  response = "Réclamation rejetée après analyse";
 }

  return prisma.Report.update({
    where: { id: complaintId},
    data: { status, response }
  });

  }

 
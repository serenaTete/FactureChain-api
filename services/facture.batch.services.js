import prisma from "../utils/prisma.js";
import QRCode from "qrcode";
import crypto from "crypto";
import {generateInvoice, storeFactureHash} from "./blockchain.service.js";
import { uuidToBytes32 } from "../utils/hash.js";
import {createAlert} from "./alerte.services.js";

/**
 * HASH
 */


/**
 * DETECTION ANOMALIES
 */
 const detectAnomalies = (monthlyKwh, history) => {
  const anomalies = [];

  const avg= history.reduce((s,v)=> s+v, 0)/ history.length;

  if(monthlyKwh > avg * 2){
    anomalies.push({type: "HIGH_BILL", severity: "HIGH", message: "Facture élevée"});
  }

  if (monthlyKwh < avg * 0.3 ) {
   anomalies.push({type: "LOW_BILL", severity: "MEDIUM", message: "consommation faible"});
  }

  

  return anomalies;
};  

/*const validateBill = (totalKwh, amount, price)=> {

const expected = totalKwh * price;
const diff = Math.abs(amount - expected);

if (diff > 1 ){
  return {
    valid: false,
    error
  }
}

} */
/**
 * GENERATION MENSUELLE
 */
export const generateMonthlyBills = async (meterId, year, month) => {


    const existing = await prisma.Facture.findFirst({
        where: {
            meterId,
             year,
              month,
              status: "GENERATED"
        }
    })

    if(existing) return existing;
  // 1. récupérer tous les users
  const start = new Date(year, month-1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const consumptions = await prisma.Consommation.findMany({
    where: {
        compteurId: meterId,
        date: {gte: start, lte: end}
    }
  });
 
    const total = consumptions.reduce((s, c) => s + c.value, 0);
    const montant = total * 100;

    // 3. facture
    const facture = await prisma.Facture.create({
      data: {
         meterId,
        montant,
        month,
        year,
        totalKwh: total
      }
    });

    
   
const chain = await generateInvoice(meterId, month, year, total, montant)
 const qrCode = await QRCode.toDataURL(
      JSON.stringify({ id: facture.id, hash: chain.hash })
    );

    await prisma.Facture.update({

        where: {id: facture.id},
        data: {hash: chain.hash, txHash: chain.txHash, qrCode}
    });
    // 4. anomalies
    const history = await prisma.Facture.findMany({
        where:{
            meterId
        },
        orderBy: {createdAt: "desc"},
        take: 6
    });

    const historyvalues = history.map( h => h.totalKwh);
    const anomalies = detectAnomalies(total, historyValues);

    for (const a of anomalies) {
      await prisma.Anomalie.create({
        data: {
          type,
          severity
          
        }
      });
use
      await prisma.alerte.create({
        data: {
          userId: user.id,
          message: `Anomalie détectée: ${a}`
        }
      });
    }

    // 5. hash
    

    // 6. blockchain
    const idBytes = uuidToBytes32(facture.id);
    await storeFactureHash(idBytes, chain.hash);

    // 7. QR
   

    // 8. update facture
   return facture;
  
  }
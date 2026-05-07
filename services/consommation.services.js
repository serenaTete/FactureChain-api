
import prisma from "../utils/prisma.js";
import { recordConsumption } from "./blockchain.service.js";
import { createAnomalie } from "./anomalieService.js";
import {hashData} from "../utils/hash.js"
import {io} from "../index.js";


export const createConsommation = async (meterId, value) => {

  const conso = await prisma.consommation.create({ 
    
    data :{

        compteurId: meterId,
        valeurKwh: value,
        date: new Date()

    }});

    

  // ⛓️ Blockchain consommation
  const hash = hashData(conso);
const meter = await prisma.Compteur.findUnique(
    {
        where: { id: compteurId},
        include: { user: true}
    }
);

if(!meter){
    throw new Error("Meter not found");
}
  const chain= await recordConsumption(
     meterId,
    value,
    Date.now()
  );

  await prisma.consommation.update({
    where: { id: conso.id },
    data: {
      hash: chain.hash,
      txhash: chain.txHash
     
    }
  });

  const idBytes = uuidToBytes32(conso.id);
    await storeConsumptionHash(idBytes, chain.hash);

  // 🚨 Détection anomalie
  let anomalie = null;
  if (data.valeurKwh > 900) {
    anomalie = await createAnomalie(conso);
  }

 const address = meter.user.address;

 io.to(`meter_${meterId}`).emit("newConsumption",{
   compteurId: meterId,
   valeurKwh: conso.valeurKwh,
    date: conso.date
 });

  return conso;
};
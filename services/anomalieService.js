// services/anomalieService.js
import prisma from "../utils/prisma.js";
import {hashData} from "../utils/hash.js";
import {reportAnomaly, storeAnomalyHash} from "./blockchain.service.js"
import {io} from "../index.js";

    const calculateSeverity =(value, average)=>{
        const ratio = average ? value / average : 1;
        if (ratio < 1.2) return 1;
        if (ratio < 1.5) return 2;
        if (ratio > 2) return 3;
        if (ratio > 3) return 4;

        return 5;
    };

    const detectType = (value, average)=>{
        const ratio = average? value / average : 1;

        if(ratio >3) return "CRITICAL_SPIKE";
        if(ratio >2) return "HIGH_CONSUMPTION";
        if(ratio < 0.5) return "LOW_CONSUMPTION";

        return "NORMAL_ANOMALY";
    }
       export const createAnomalie = async(consommation)=>{

      const userAddress = consommation.meter.user.address;
      const avgData = await prisma.consommation.aggregate({
    where: {
        compteurId: consommation.compteurId},
        _avg: {value: true}
    
});

const average = avgData._avg.value || 0;

const type = detectType(consommation.value, average);
const severity = calculateSeverity(consommation.valeurKwh, average);
const description = `Consommation ${consommation.valeurKwh} vs moyenne ${average}`;
const anomalyData = {

    data :{

        consommationId: consommation.id,
        type: type,
        description: description,
        createdAt: new Date()

    }


}

  const hash = hashData(anomalyData);

  const anomaly= await prisma.Anomalie.create({
    data:{
       consommationId: consommation.id,
        type: type,
        description: description,
        createdAt: new Date()
    }

    
  

  });

  const chain= await reportAnomaly(
   
         consommation.id,
        type,
         description,
        new Date()
  );
   await prisma.Anomalie.update({

        where: {id: anomaly.id},
        data: {hash: chain.hash, txHash: chain.txHash}
    });

    const idBytes = uuidToBytes32(anomaly.id);
    await storeAnomalyHash(idBytes, chain.hash);

 io.to(`meter_${meterId}`).emit("alert", anomaly);

  return anomaly;

};

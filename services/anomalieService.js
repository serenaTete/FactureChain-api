// services/anomalieService.js
import prisma from "../utils/prisma.js";
import { storeOnBlockchain } from "./blockchain.service.js";
import {hashData} from "../hash.js";
import {reportAnomaly} from "./blockchain.service.js"


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
       export const createAnomaly = async(consommation)=>{

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
        ...anomalyData,
        hash
    }

    
  

  });

  await reportAnomaly(
    userAddress,
    hash,
    consommation.hash,
    severity
  );
  return anomaly;

};

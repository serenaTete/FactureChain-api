// services/simulationService.js
import { createConsommation } from "./consommation.services.js";
import {getAssignedMeters} from "./meter.services.js";


const random = (min, max) => Math.random() * (max - min) + min;

const generateValue = () => {
  if (Math.random() < 0.1) return random(1000, 2000);
  return random(50, 300);
};

export const runSimulation = async () => {

 const meters = await getAssignedMeters();
 for( let meter of meters){
    const value = generateValue();
    await createConsommation(meter.compteurId, value)
 }

}
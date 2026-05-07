import cron from "node-cron";
import prisma from "../utils/prisma.js";
import { generateMonthlyBills } from "../services/facture.batch.services.js";

export const startBilling = () => {
cron.schedule("0 0 1 * *", async () => {

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const meters = await prisma.Compteur.findMany({
    where: {status: "ASSIGNED"}
  });

  for (const meter of meters) {

try{
  await generateMonthlyBills(meter.id, year, month);
}catch(err){
  console.error(`Erreur compteur *{meter.id}`, err.message);
}
    
}
console.log("facturation terminée");

});

}
import cron from "node-cron";
import prisma from "../utils/prisma.js";
import { simulateConsumption } from "../services/consommation.service.js";

/**
 * ⏱️ toutes les 5 minutes
 */
cron.schedule("*/5 * * * *", async () => {

  const users = await prisma.user.findMany();

  for (const user of users) {
    await simulateConsumption(user.id);
  }

  console.log("📊 Simulation + blockchain exécutée");
});
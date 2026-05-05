import cron from "node-cron";
import prisma from "../utils/prisma.js";
import { generateFacture } from "../services/facture.service.js";

cron.schedule("59 23 28-31 * *", async () => {

  const users = await prisma.user.findMany();

  for (const user of users) {

    const conso = await prisma.consommation.findFirst({
      where: { userId: user.id }
    });

    if (conso) {
      await generateFacture(conso);
    }
  }

});
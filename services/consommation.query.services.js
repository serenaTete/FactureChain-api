import prisma from "../utils/prisma.js";

/**
 * 🔴 TEMPS RÉEL
 */

export const getRealtime = async (userId) => {
  return prisma.consommation.findFirst({
    where: { consommatioId},
    orderBy: { timestamp: "desc" }
  });
};

/**
 * 📅 JOUR
 */
export const getDaily = async (address, date) => {
 
    const start = new Date(date);
  start.setHours(0,0,0,0);

  const end = new Date(date);
  end.setHours(23,59,59,999);

  return prisma.Compteur.findMany({
    where: {
      userId,
      timestamp: { gte: start, lte: end }
    }
  });
};

/**
 * 📆 MOIS
 */
export const getMonthly = async (userId, year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return prisma.consommation.findMany({
    where: {
      userId,
      timestamp: { gte: start, lte: end }
    }
  });
};

/**
 * 📈 ANNÉE
 */
export const getYearly = async (userId, year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  return prisma.consommation.findMany({
    where: {
      userId,
      timestamp: { gte: start, lte: end }
    }
  });
};
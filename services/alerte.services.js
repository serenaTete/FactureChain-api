import prisma from "../utils/prisma.js";

export const getUserAlerts = (userId) => {
  return prisma.alerte.findMany({
    where: { userId }
  });
};

export const markAsSeen = (id) => {
  return prisma.alerte.update({
    where: { id },
    data: { seen: true }
  });
};

export const createAlert = async (data) => {

  return prisma.Alerte.create({data});
}
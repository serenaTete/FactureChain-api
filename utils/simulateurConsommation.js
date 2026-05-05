// utils/simulateurConsommation.js
import prisma from "./prisma.js";

// Générateur aléatoire
const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Générer une date passée
const randomDate = (daysBack = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// Simulation principale
export const simulateConsommations = async ({
  compteurId,
  nombre = 50
}) => {
  const results = [];

  for (let i = 0; i < nombre; i++) {
    let valeur;

    // 🔥 80% normal / 20% anomalie
    if (Math.random() < 0.8) {
      valeur = random(50, 300); // consommation normale
    } else {
      valeur = random(1000, 2000); // anomalie
    }

    const conso = await prisma.consommation.create({
      data: {
        compteurId,
        valeurKwh: parseFloat(valeur.toFixed(2)),
        date: randomDate()
      }
    });

    results.push(conso);
  }

  return results;
};
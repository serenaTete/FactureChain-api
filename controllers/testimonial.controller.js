import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      profession,
      city,
      realAmount,
      usualAmount,
      problem,
      description,
    } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        profession,
        city,
        realAmount: Number(realAmount),
        usualAmount: Number(usualAmount),
        problem,
        description,
      },
    });

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getTestimonials = async (req, res) => {
  const data = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(data);
};
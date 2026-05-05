import express from "express";
import {
  createTestimonial,
  getTestimonials,
} from "../controllers/testimonial.controller.js";

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getTestimonials);

export default router;
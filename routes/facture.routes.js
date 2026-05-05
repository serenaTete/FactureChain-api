
import express from "express";
import {
  createFacture,
  listFactures
} from "../controllers/facture.controller.js";

const router = express.Router();

router.post("/generer/:consommationId", createFacture);
router.get("/", listFactures);

export default router;
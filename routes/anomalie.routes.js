// routes/anomalieRoutes.js
import express from "express";
import {
  listAnomalies,
  getOneAnomalie,
  removeAnomalie,
  resolveAnomalie
} from "../controllers/anomalie.controller.js";

const router = express.Router();

router.get("/", listAnomalies);
router.get("/:id", getOneAnomalie);
router.delete("/:id", removeAnomalie);
router.put("/:id/resoudre", resolveAnomalie);

export default router;
// routes/simulationRoutes.js
import express from "express";
import { simulate } from "../controllers/simulationController.js";

const router = express.Router();

router.post("/", simulate);

export default router;
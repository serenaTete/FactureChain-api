import express from "express";
import {history} from "../controllers/consommation.controller.js";

const router = express.Router();

router.get("/history", history);

export default router;
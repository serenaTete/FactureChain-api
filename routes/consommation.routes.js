import express from "express";
import {history} from "../controllers/consommation.controller.js";
import {authMiddleware} from "../middlewares/auth.js";
import {roleMiddleware} from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/history", 
    authMiddleware,
    history);

export default router;
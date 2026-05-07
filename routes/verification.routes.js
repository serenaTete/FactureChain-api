import express from "express";
import * as ctrl from "../controllers/verification.controller.js";
import {authMiddleware} from "../middlewares/auth.js";
import {roleMiddleware} from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/",
    authMiddleware,
    ctrl.verify);

export default router;
import express from "express";
import * as ctrl from "../controllers/consommation.controller.js";

const router = express.Router();

router.get("/realtime/:userId", ctrl.realtime);
router.get("/daily/:userId", ctrl.daily);
router.get("/monthly/:userId", ctrl.monthly);
router.get("/yearly/:userId", ctrl.yearly);

export default router;
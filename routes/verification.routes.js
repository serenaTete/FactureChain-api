import express from "express";
import * as ctrl from "../controllers/verification.controller.js";

const router = express.Router();

router.post("/", ctrl.verify);

export default router;
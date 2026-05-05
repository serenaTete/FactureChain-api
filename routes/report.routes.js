import express from "express";
import * as ctrl from "../controllers/report.controller.js";

const router = express.Router();

// soumettre
router.post("/", ctrl.create);

// suivi user
router.get("/user/:userId", ctrl.getUser);

// détail
router.get("/:id", ctrl.getOne);

// traitement admin
router.put("/process", ctrl.process);

export default router;
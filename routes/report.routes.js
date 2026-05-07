import express from "express";
import * as ctrl from "../controllers/report.controller.js";
import {authMiddleware} from "../middlewares/auth.js";
import {roleMiddleware} from "../middlewares/role.middleware.js";




const router = express.Router();

// soumettre
router.post(
    "/",
    authMiddleware,
     ctrl.create);

// suivi user
router.get(
    "/user/:userId",
    authMiddleware,
     ctrl.getUser);

// détail
router.get(
    "/:id",
    authMiddleware,
     ctrl.getOne);

// traitement admin
router.put(
    "/process",
    authMiddleware,
    roleMiddleware("ADMIN"),
     ctrl.process);

export default router;
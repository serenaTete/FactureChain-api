import express from "express";
import * as controller from "../controllers/auth.controller.js";

const router =express.Router();

router.post("/nonce", controller.nonce);
router.post("/login", controller.login);

export default Router;
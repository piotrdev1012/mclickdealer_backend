import express from "express";
import { saveTrackingLinks } from "../controllers/trackingLink.controller";

const router = express.Router();
console.log("trackingLinks");
// router.get("/", getTokens); // Get all tokens
router.post("/", saveTrackingLinks); // Save tokens

export default router;
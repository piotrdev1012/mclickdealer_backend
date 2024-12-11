import express from "express";
import { getTokens, saveTokens } from "../controllers/token.controller";

const router = express.Router();
console.log("tokenrouter");
router.get("/", getTokens); // Get all tokens
router.post("/", saveTokens); // Save tokens

export default router;

import { Request, Response } from "express";
import Token from "../models/token.model";
// import db from 'mongoose';

// Get all tokens
export const getTokens = async (req: Request, res: Response) => {
  try {
    const tokens = await Token.find();
    // const tokens = db.tokens.find().pretty();
    console.log("kkkkk");
    res.json(tokens);
    console.log(tokens);
  } catch (error) {
    // res.status(500).json({ error: error.message });
  }
};

// Add or update tokens
export const saveTokens = async (req: Request, res: Response) => {
  try {
    const { tokens } = req.body; // Expect an array of tokens
    await Token.deleteMany(); // Clear existing tokens
    const newTokens = await Token.insertMany(tokens); // Add new tokens
    res.json({ message: "Tokens saved successfully", newTokens });
  } catch (error) {
    // res.status(500).json({ error: error.message });
  }
};

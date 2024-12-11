import { IUserDocument } from "./../models/user.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
// Define a type for the user payload in the JWT
interface UserPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserDocument;
  }
}
export default async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Check if the request contains a token in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    // Extract the token from the header and verify it
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as UserPayload;

    // Find the user in the database using the user ID from the decoded token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Add the user object to the request object for downstream middleware to use
    req.user = user;

    // Move on to the next middleware
    next();
  } catch (error) {
    // Handle unauthorized access error
    res.status(401).json({ message: "Unauthorized access" });
  }
}

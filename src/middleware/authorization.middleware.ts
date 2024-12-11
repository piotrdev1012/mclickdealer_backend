import { IUserDocument } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
// Define a type for the user payload in the JWT
interface UserPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserDocument;
  }
}
export default function authorizationMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Check if the user object is available from the authentication middleware
      const user = req.user as IUserDocument;

      if (!user) {
        res.status(401).json({ message: "User not authenticated" });
        return; // Explicitly return after sending a response
      }

      // Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ message: "Access denied: Insufficient permissions" });
        return;
      }

      // Proceed if the role is allowed
      next();
    } catch (error) {
      const errMsg = (error instanceof Error) ? error.message : "Access denied";
      res.status(403).json({ message: errMsg });
    }
  };
}

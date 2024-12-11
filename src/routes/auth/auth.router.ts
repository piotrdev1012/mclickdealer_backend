import { Router } from "express";
import UserController from "../../controllers/auth/auth.controller";
// import auth from "../middleware/auth";
import authMiddleware from "../../middleware/authentication.middleware";
const router = Router();

router.post("/login", UserController.loginUser);
router.get("/", authMiddleware, UserController.loadUser);
router.post("/register", UserController.createUser);
router.put("/", authMiddleware, UserController.updateUser);
router.get("/verify-email", UserController.verifyEmail);
router.post("/verify-code", UserController.verifyCode);
router.post("/reset-password", UserController.resetPassword);

export default router;

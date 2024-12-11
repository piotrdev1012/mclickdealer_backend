import { Router } from "express";
import authMiddleware from "../middleware/authentication.middleware";
import PaymentController from "../controllers/payment.controller";
const router = Router();

router.get("/get", authMiddleware, PaymentController.getBalance);
router.post("/deposit", authMiddleware, PaymentController.deposit);
router.post("/withdrawl", authMiddleware, PaymentController.withdrawl);
router.get("/transactions", authMiddleware, PaymentController.getTransactions);

export default router;
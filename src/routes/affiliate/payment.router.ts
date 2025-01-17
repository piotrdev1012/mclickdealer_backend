import { Router } from "express";
import authMiddleware from "../../middleware/authentication.middleware";
import authorize from "../../middleware/authorization.middleware";
import PaymentController from "../../controllers/payment.controller";
const router = Router();

router.post("/get", authMiddleware, authorize(["affiliate"]), PaymentController.getBalance);
router.post("/deposit", authMiddleware, authorize(["affiliate"]), PaymentController.deposit);
router.post("/withdrawl", authMiddleware, authorize(["affiliate"]), PaymentController.withdrawl);

export default router;
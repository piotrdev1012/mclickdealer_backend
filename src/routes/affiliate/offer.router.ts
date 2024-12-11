import { Router } from "express";
import AffiliateOfferController from "../../controllers/affiliate/offer.controller";
// import auth from "../../middleware/auth";
import authMiddleware from "../../middleware/authentication.middleware";
import authorize from "../../middleware/authorization.middleware";
import upload from '../../config/multer';

const router = Router();

// router.get("/", authMiddleware, authorize(["affiliate"]),  AffiliateOfferController.readOffers);
router.post("/filtered", authMiddleware, authorize(["affiliate"]), AffiliateOfferController.getFilteredOffer);

export default router;

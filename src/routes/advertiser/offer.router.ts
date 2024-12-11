import { Router } from "express";
import AdvertiserOfferController from "../../controllers/advertiser/offer.controller";
// import auth from "../../middleware/auth";
import authMiddleware from "../../middleware/authentication.middleware";
import authorize from "../../middleware/authorization.middleware";

import upload from '../../config/multer';

const router = Router();

router.post("/", authMiddleware, authorize(["advertiser"]), upload.single("imageUrl"), AdvertiserOfferController.createOffer);
// router.get("/", authMiddleware, authorize(["advertiser"]),  AdvertiserOfferController.readOffers);
router.put("/", authMiddleware, authorize(["advertiser"]), AdvertiserOfferController.updateOffer);
router.post("/destory", authMiddleware, authorize(["advertiser"]), AdvertiserOfferController.deleteOffer);

// Get filtered offers instead of all offers
router.post("/filtered", authMiddleware, authorize(["advertiser"]), AdvertiserOfferController.getFilteredOffer);

export default router;

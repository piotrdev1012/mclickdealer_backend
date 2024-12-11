import { Router } from "express";
import AdvertiserCampaignController from "../../controllers/advertiser/campaign.controller";
// import auth from "../../middleware/auth";
import authMiddleware from "../../middleware/authentication.middleware";
import authorize from "../../middleware/authorization.middleware";
const router = Router();

router.post("/filtered", authMiddleware, authorize(["advertiser"]), AdvertiserCampaignController.getFilteredCampaign);
router.post("/accept", authMiddleware, authorize(["advertiser"]), AdvertiserCampaignController.acceptPendingCampaign);
router.post("/decline", authMiddleware, authorize(["advertiser"]), AdvertiserCampaignController.declinePendingCampaign);
router.post("/close", authMiddleware, authorize(["advertiser"]), AdvertiserCampaignController.closeContract);
router.get("/:campaignId", authMiddleware, authorize(["advertiser"]), AdvertiserCampaignController.getCampaignById);

// Add by Carl 11/20/2024
// router.get("/:_id", authMiddleware, authorize(["advertiser"]), CampaignController.getCampaignById);
// console.log(router.get("/:id"));

export default router;

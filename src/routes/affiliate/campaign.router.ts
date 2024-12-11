import { Router } from "express";
import AffiliateCampaignController from "../../controllers/affiliate/campaign.controller";
// import auth from "../middleware/auth";
import authMiddleware from "../../middleware/authentication.middleware";
import authorize from "../../middleware/authorization.middleware";
const router = Router();

router.post("/filtered", authMiddleware, authorize(["affiliate"]), AffiliateCampaignController.getFilteredCampaign);
router.post("/request", authMiddleware, authorize(["affiliate"]), AffiliateCampaignController.requestCampaign);
router.post("/cancel", authMiddleware, authorize(["affiliate"]), AffiliateCampaignController.cancelCampaign);
router.get("/:campaignId", authMiddleware, authorize(["affiliate"]), AffiliateCampaignController.getCampaignById);

export default router;

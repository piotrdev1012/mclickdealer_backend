import { Request, Response } from "express";
import Campaign, { ICampaignDocument } from "../../models/campaign.model";
import Offer from "../../models/offer.model";
import { formatCampaignData } from "../../helper/optimizeCampaignToViewData";

class CampaignController {
  public static async getFilteredCampaign(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const {
        countries, // List of countries to filter by
        platforms, // List of platforms to filter by
        priceFormats, // Price format filter
        verticals, // Vertical filter
        myVerticalsOnly, // Flag to filter offers by vertical
        showInactive, // Flag to include/exclude inactive offers
        role,
        id,
        status,
      } = req.body;

      console.log("req.body =>", req.body);

      // Step 1: Find campaigns for the given affiliateId
      let campaignQuery: any = { affiliateId: req.user?.id };

      if (status) {
        campaignQuery.status = status; // Add status filter if provided
      }

      console.log("req.body =>", campaignQuery);

      // Fetch campaigns for the affiliate
      const campaigns = await Campaign.find(campaignQuery);

      if (!campaigns.length) {
        return res.status(200).json({
          status: 1,
          campaigns: [],
          message: "No campaigns found for the given affiliate.",
        });
      }

      // Extract offer IDs from the campaigns
      const offerIds = campaigns.map((campaign) => campaign.offerId);

      // Step 2: Filter offers related to the campaigns
      let offerQuery: any = { _id: { $in: offerIds } };

      // Apply offer filters
      if (countries && Array.isArray(countries) && countries.length > 0) {
        offerQuery.allowedCountries = { $in: countries };
      }
      if (platforms && Array.isArray(platforms) && platforms.length > 0) {
        offerQuery.platforms = { $in: platforms };
      }
      if (
        priceFormats &&
        Array.isArray(priceFormats) &&
        priceFormats.length > 0
      ) {
        offerQuery.priceFormat = { $in: priceFormats };
      }
      if (verticals && Array.isArray(verticals) && verticals.length > 0) {
        offerQuery.vertical = { $in: verticals };
      }

      // Fetch filtered offers
      const filteredOffers = await Offer.find(offerQuery);

      if (!filteredOffers.length) {
        return res.status(200).json({
          status: 1,
          campaigns: [],
          message: "No matching offers found for the campaigns.",
        });
      }

      // Step 3: Map filtered offers back to campaigns
      const filteredOfferIds = filteredOffers.map((offer) => offer._id);

      const populatedCampaigns = await Campaign.find({
        offerId: { $in: filteredOfferIds },
      }).populate("offerId");

      const formattedCampaigns = await Promise.all(
        populatedCampaigns.map(async (campaign) => {
          const campaignData = await formatCampaignData(campaign);
          return campaignData // Fallback in case there's no offerData (optional)
        })
      );

      // Return the filtered offers in the response
      return res.status(200).json({
        status: 1,
        campaigns: formattedCampaigns ,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Campaigns not found!",
      });
    }
  }

  public static async requestCampaign(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      console.log("Create Campaign Request Body:", req.body);

      const { offerId} = req.body;

      const advertiserId = (await Offer.findById(offerId))?.advertiserId;
      const offerName = (await Offer.findById(offerId))?.offerName;
      const priceFormat = (await Offer.findById(offerId))?.priceFormat;
      const affiliateId = req.user?.id;

      const newCampaign: ICampaignDocument = await Campaign.create({
        advertiserId,
        affiliateId,
        offerId,
        priceFormat,
        offerName,
        status: "pending",
      });

      return res.status(200).json({
        message: "Campaign created successfully",
        campaign: newCampaign,
      });
    } catch (error) {
      console.error("Error in createCampaign:", error);
      return res.status(404).json({
        message: "Campaign creation failed!",
      });
    }
  }

  public static async cancelCampaign(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      // Extract campaign ID from the request parameters
      const { campaignId } = req.body;
  
      // Find the campaign by ID and update its status
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId, // Campaign ID to find
        { status: "canceled" }, // Fields to update
        { new: true } // Return the updated document
      );
  
      // If the campaign was not found
      if (!updatedCampaign) {
        return res.status(404).json({
          message: "Campaign not found",
        });
      }

      const resultCampaign = await formatCampaignData(updatedCampaign);
  
      // Return the updated campaign details
      return res.status(200).json({
        message: "Campaign canceled successfully",
        campaign: resultCampaign,
      });
    } catch (error) {
      console.error("Error in cancelCampaign:", error);
  
      // Handle unexpected errors
      return res.status(500).json({
        message: "Failed to cancel the campaign!",
      });
    }
  }

  public static async getCampaignById(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const campaignId = req.params.campaignId;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      const resultCampaign = await formatCampaignData(campaign);

      return res.status(200).json({
        message: "Campaign canceled successfully",
        campaign: resultCampaign,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Failed to get the campaign!",
      });
    }
  }
}
export default CampaignController;

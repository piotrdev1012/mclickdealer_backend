import { ICampaignDocument } from "../models/campaign.model";
import Offer from "../models/offer.model";

export const formatCampaignData = async (campaign: ICampaignDocument): Promise<any> => {
    const campaignData = campaign.toObject(); // Convert Mongoose document to plain object
    const campaignStatus = campaignData.status;
  
    try {
      // Fetch the offer data using the offerId and convert to plain object
      const offer = await Offer.findById(campaign.offerId);
      const offerData = offer ? offer.toObject() : null;
  
      if (offerData) {
        // Retain the original offerId and merge campaign & offer data
        const tempOfferId = offerData._id;
        delete offerData._id;
  
        const mergedCampaign = {
          ...campaignData,
          ...offerData,
          offerId: tempOfferId,
          status: campaignStatus, // Ensure the campaign's status overrides the offer's
        };
  
        return mergedCampaign;
      }
  
      // Return campaign data if no offer is found
      throw new Error("Related Offer data is not exist")      
    } catch (error) {
      console.error("Error formatting campaign data:", error);
      return campaignData; // Fallback to campaign data in case of errors
    }
  };
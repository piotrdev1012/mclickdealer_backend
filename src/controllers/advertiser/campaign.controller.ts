import { Request, Response } from "express";
import Campaign, { ICampaignDocument } from "../../models/campaign.model";
import Offer from "../../models/offer.model";
import { formatCampaignData } from "../../helper/optimizeCampaignToViewData";
import Transaction from "../../models/transaction.model";
import User from "../../models/user.model";

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
        status,
      } = req.body;

      console.log("req.body =>", req.body);

      // Step 1: Find campaigns for the given affiliateId
      let campaignQuery: any = { advertiserId: req.user?.id };

      if (status) {
        campaignQuery.status = status; // Add status filter if provided
      }

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
          return campaignData; // Fallback in case there's no offerData (optional)
        })
      );

      // Return the filtered offers in the response
      return res.status(200).json({
        campaigns: formattedCampaigns,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Campaigns not found!",
      });
    }
  }

  public static async acceptPendingCampaign(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      console.log("Create Campaign Request Body:", req.body);

      const { campaignId } = req.body;

      const pendingCampaign = await Campaign.findById(campaignId);
      // const pendingCampaignWithOfferId = await Campaign.findById(
      //   campaignId
      // ).populate("offerId");
      // const user = req.user;

      // if (
      //   user &&
      //   pendingCampaignWithOfferId &&
      //   pendingCampaignWithOfferId.offerId
      // ) {
      //   const payout = pendingCampaignWithOfferId.offerId?.payout;
      //   if (payout > user?.balance)
      //     return res.status(404).json({
      //       message: "You don't have enough balance to accept campaign",
      //     });
      //   user.balance = user.balance - Number(payout);
      //   await user.save();
      //   await Transaction.create({
      //     userId: user._id,
      //     type: "payout",
      //     amount: payout,
      //     date: new Date(),
      //     status: "pending",
      //     campaignId: pendingCampaign?._id,
      //   });

      //   await Transaction.create({
      //     userId: pendingCampaign?.affiliateId,
      //     type: "payin",
      //     amount: payout,
      //     date: new Date(),
      //     status: "pending",
      //     campaignId: pendingCampaign?._id,
      //   });
      // } else {
      //   return res.status(404).json({
      //     message: "Some thing went wrong!",
      //   });
      // }

      if (pendingCampaign) {
        pendingCampaign.status = "active";
        await pendingCampaign.save();

        const formattedPendingCampaign = await formatCampaignData(
          pendingCampaign
        );
        return res.status(200).json({
          campaign: formattedPendingCampaign,
          message: "Accept the allication successfully",
        });
      } else {
        throw new Error("Campaign not found");
      }
    } catch (error) {
      console.error("Error in createCampaign:", error);
      return res.status(404).json({
        message: error,
      });
    }
  }

  public static async closeContract(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      console.log("Create Campaign Request Body:", req.body);

      const { campaignId } = req.body;

      const pendingCampaign = await Campaign.findById(campaignId);
      // const pendingCampaignWithOfferId = await Campaign.findById(
      //   campaignId
      // ).populate("offerId");
      // const user = req.user;

      // if (
      //   user && pendingCampaign &&
      //   pendingCampaignWithOfferId &&
      //   pendingCampaignWithOfferId.offerId
      // ) {
      //   await Transaction.updateOne(
      //     { userId: user._id }, // Find criteria
      //     { $set: { status: "completed" } } // Update only the status field
      //   );

      //   await Transaction.updateOne(
      //     { userId: pendingCampaign.affiliateId }, // Find criteria
      //     { $set: { status: "completed" } } // Update only the status field
      //   );

      //   const affiliateUser = await User.findById(
      //     pendingCampaign.affiliateId
      //   );

      //   if (affiliateUser) {
      //     // Update balance
      //     affiliateUser.balance =
      //       (affiliateUser.balance || 0) +
      //       Number(pendingCampaignWithOfferId.offerId.payout);

      //     // Save updated user document
      //     await affiliateUser.save();
      //   }
      // } else {
      //   return res.status(404).json({
      //     message: "Some thing went wrong!",
      //   });
      // }

      if (pendingCampaign) {
        pendingCampaign.status = "closed";
        await pendingCampaign.save();

        const formattedPendingCampaign = await formatCampaignData(
          pendingCampaign
        );
        return res.status(200).json({
          campaign: formattedPendingCampaign,
          message: "Close the application successfully",
        });
      } else {
        throw new Error("Campaign not found");
      }
    } catch (error) {
      console.error("Error in close campaign:", error);
      return res.status(404).json({
        message: "Campaign close failed!",
      });
    }
  }

  public static async declinePendingCampaign(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      console.log("Create Campaign Request Body:", req.body);

      const { campaignId } = req.body;

      const pendingCampaign = await Campaign.findById(campaignId);

      if (pendingCampaign) {
        pendingCampaign.status = "declined";
        await pendingCampaign.save();

        const formattedPendingCampaign = await formatCampaignData(
          pendingCampaign
        );

        return res.status(200).json({
          campaign: formattedPendingCampaign,
          message: "Declined the allication",
        });
      } else {
        throw new Error("Campaign not found");
      }
    } catch (error) {
      console.error("Error in createCampaign:", error);
      return res.status(404).json({
        message: "Campaign creation failed!",
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
        return res.status(404).json({ message: "Campaign not found" });
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
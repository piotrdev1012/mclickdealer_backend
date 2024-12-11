// click.controller.ts
import { Request, Response } from 'express';
import Click from '../models/click.model'; // Assuming you have this model created
import Conversion from '../models/conversion.model'; // Assuming you have this model created
import Campaign from '../models/campaign.model'; // Import your campaign model
import mongoose from 'mongoose';
import Transaction from '../models/transaction.model';
import User from '../models/user.model';

export const trackClick = async (req: Request, res: Response) => {
    console.log("click? no click");
  try {
    const {
      campaignId,
      affiliateId,
      advertiserId,
      ip,
      userAgent,
      subIds,
      geo,
      redirectUrl,
    } = req.body;

    const pendingCampaignWithOfferId = await Campaign.findById(
      campaignId
    ).populate("offerId");
    const newClick = new Click({
      campaignId,
      affiliateId,
      advertiserId,
      IP: ip || req.ip,
      device: userAgent || req.headers['user-agent'] || 'unknown',
      geo: geo || 'unknown',
      status: "pending",
    });

    console.log(newClick);
    await newClick.save();

    const advertiser = await User.findById(advertiserId);
    if (advertiser) {
      if (pendingCampaignWithOfferId?.offerId.payout > advertiser?.balance)
        return res.status(404).json({
          message: "You don't have enough pay for the click",
        });
      else advertiser.balance = advertiser.balance - Number(pendingCampaignWithOfferId?.offerId.payout);

      await advertiser.save();
    }

    const newAdvertiserTransaction = new Transaction({
      userId: advertiserId,
      campaignId: campaignId,
      clickId: newClick._id,
      conversionId: null,
      type: "payout",
      status: "pending",
      amount: pendingCampaignWithOfferId?.offerId.payout,
      date: new Date(),
    });

    await newAdvertiserTransaction.save();

    const newAffiliateTransaction = new Transaction({
      userId: affiliateId,
      campaignId: campaignId,
      clickId: newClick._id,
      conversionId: null,
      type: "payin",
      status: "pending",
      amount: pendingCampaignWithOfferId?.offerId.payout,
      date: new Date(),
    });

    await newAffiliateTransaction.save();

    console.log(redirectUrl);
    // Redirect to the actual URL
    // res.redirect(redirectUrl as string);
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).send('Error tracking click');
  }
};

export const trackConversion = async (req: Request, res: Response) => {
  try {
      // Log the full body to see what data is being received
      const { campaignId, affiliateId, advertiserId, price } = req.body;
      
      // Check if values are extracted correctly
      if (!campaignId || !affiliateId || !advertiserId) {
          return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Save the conversion data
      const newConversion = new Conversion({
          campaignId,
          affiliateId,
          advertiserId,
          price,
      });

      await newConversion.save();

      // Respond back
      res.json({ message: 'Conversion tracked successfully' });

  } catch (error) {
      console.error('Error tracking conversion:', error);
      res.status(500).send('Error tracking conversion');
  }
};



export const getClickData = async (req: Request, res: Response) => {
  try {
    // Fetch all click data
    const clicks = await Click.find().lean();
    console.log(clicks);

    // Get unique campaign IDs to minimize duplicate queries
    const campaignIds = [...new Set(clicks.map((click) => click.campaignId))];

    // Convert campaignIds to ObjectId if valid, otherwise filter them out
    const campaignObjectIds = campaignIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Only keep valid ObjectIds
      .map((id) => new mongoose.Types.ObjectId(id)); // Convert to ObjectId

    if (campaignObjectIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid campaign IDs found' });
    }

    // Fetch campaign details for all unique campaign IDs
    const campaigns = await Campaign.find({
      _id: { $in: campaignObjectIds }
    }).lean();

    // Create a mapping of campaign ID to campaign details
    const campaignMap: Record<string, any> = campaigns.reduce((map, campaign) => {
      map[campaign._id.toString()] = campaign; // Ensure campaign._id is a string
      return map;
    }, {} as Record<string, any>);

    // Enhance click data with campaign details
    const enrichedClicks = clicks.map((click) => {
      const campaign = campaignMap[click.campaignId] || {};
      console.log("kkkkkkkkkkkkkk");
      console.log(campaign);
      return {
        ...click,
        priceFormat: campaign.priceFormat || 'CPA',
        campaignName: campaign.offerName || 'Unknown',
      };
    });
    console.log(enrichedClicks);
    res.status(200).json({ success: true, data: enrichedClicks });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).json({ success: false, message: 'Error fetching clicks' });
  }
};

export const approveRejectClick = async (req: Request, res: Response) => {
  try {
    // Extract actionType and the id of the click from the request
    const { actionType, clickId } = req.body;

    // Check the action type and prepare the update object accordingly
    const statusUpdate = actionType === 'approve' ? { status: 'approved' } : { status: 'rejected' };

    const updatedAdvertiserTransaction = await Transaction.findOneAndUpdate(
      { clickId, type: "payout" },
      { $set: statusUpdate },  // set the new status
      { new: true, lean: true }  // options to return the updated object as a plain object
    );

    // Update the affiliate's transaction
    const updatedAffiliateTransaction = await Transaction.findOneAndUpdate(
        { clickId, type: "payin" },
        { $set: statusUpdate },  // set the new status
        { new: true, lean: true }  // options to return the updated object as a plain object
    );

    const advertiser = await User.findById(updatedAdvertiserTransaction?.userId) ;
    const affiliate =  await User.findById(updatedAffiliateTransaction?.userId);
    const pendingCampaignWithOfferId = await Campaign.findById(
      updatedAffiliateTransaction?.campaignId
    ).populate("offerId");

    if (statusUpdate.status === 'rejected') {
      advertiser && (advertiser.balance = advertiser.balance + Number(pendingCampaignWithOfferId?.offerId.payout));
      await advertiser?.save();
    } else if (statusUpdate.status === 'approved') {
      affiliate && (affiliate.balance = affiliate.balance + Number(pendingCampaignWithOfferId?.offerId.payout));
      await affiliate?.save();
    }

    // Update the click in the database
    const updatedClick = await Click.findOneAndUpdate(
      { _id: clickId }, // Find the click by id
      { $set: statusUpdate }, // Set the status based on the actionType
      { new: true } // Option to return the updated document
    );

    // Check if the click was successfully updated
    if (!updatedClick) {
      return res.status(404).send({ message: 'Click not found' });
    }

    // Respond with the updated click
    return res.status(200).json(updatedClick);
  } catch (error) {
    // Handle any errors that occur during the update
    return res.status(500).json({ message: 'Server error', error });
  }
};


// export const getConversionData = async (req: Request, res: Response) => {
//   try {
//     // Fetch all click data
//     const conversions = await Conversion.find().lean();
//     console.log(conversions);

//     // Get unique campaign IDs to minimize duplicate queries
//     const campaignIds = [...new Set(conversions.map((conversion) => conversion.campaignId))];

//     // Convert campaignIds to ObjectId if valid, otherwise filter them out
//     const campaignObjectIds = campaignIds
//       .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Only keep valid ObjectIds
//       .map((id) => new mongoose.Types.ObjectId(id)); // Convert to ObjectId

//     if (campaignObjectIds.length === 0) {
//       return res.status(400).json({ success: false, message: 'No valid campaign IDs found' });
//     }

//     // Fetch campaign details for all unique campaign IDs
//     const campaigns = await Campaign.find({
//       _id: { $in: campaignObjectIds }
//     }).lean();

//     // Create a mapping of campaign ID to campaign details
//     const campaignMap: Record<string, any> = campaigns.reduce((map, campaign) => {
//       map[campaign._id.toString()] = campaign; // Ensure campaign._id is a string
//       return map;
//     }, {} as Record<string, any>);

//     // Enhance click data with campaign details
//     const enrichedClicks = conversions.map((conversion) => {
//       const campaign = campaignMap[conversion.campaignId];
//       if (!campaign) {
//         console.log(`No campaign found for campaignId: ${conversion.campaignId}`);
//       }
//       console.log("kkkkkkkkkkkkkk");
//       console.log(campaign);
//       return {
//         ...conversion,
//         priceFormat: campaign.priceFormat || 'Unknown',
//         campaignName: campaign.offerName || 'Unknown',
//       };
//     });
//     console.log(enrichedClicks);
//     res.status(200).json({ success: true, data: enrichedClicks });
//   } catch (error) {
//     console.error('Error fetching conversions:', error);
//     res.status(500).json({ success: false, message: 'Error fetching conversions' });
//   }
// };



export const getConversionData = async (req: Request, res: Response) => {
  try {
    // Fetch all click data
    const conversions = await Conversion.find().lean();
    if (!conversions || conversions.length === 0) {
      return res.status(404).json({ success: false, message: 'No conversions found' });
    }
    console.log('Fetched Conversions:', conversions);

    // Get unique campaign IDs
    const campaignIds = [...new Set(conversions.map((conversion) => conversion.campaignId))];

    // Convert campaignIds to ObjectId if valid, otherwise filter them out
    const campaignObjectIds = campaignIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Only keep valid ObjectIds
      .map((id) => new mongoose.Types.ObjectId(id)); // Convert to ObjectId

    if (campaignObjectIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid campaign IDs found' });
    }

    // Fetch campaign details for all unique campaign IDs
    const campaigns = await Campaign.find({
      _id: { $in: campaignObjectIds },
    }).lean();
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ success: false, message: 'No campaigns found for the provided campaign IDs' });
    }

    console.log("aaaaaaaaaaa");
    console.log(campaigns);

    // Create a mapping of campaign ID to campaign details
    const campaignMap: Record<string, any> = campaigns.reduce((map, campaign) => {
      map[campaign._id.toString()] = campaign; // Ensure campaign._id is a string
      return map;
    }, {} as Record<string, any>);

    // Enhance conversion data with campaign details
    const enrichedClicks = conversions.map((conversion) => {
      const campaign = campaignMap[conversion.campaignId];
      if (!campaign) {
        console.log(`No campaign found for campaignId: ${conversion.campaignId}`);
      }
      return {
        ...conversion,
        priceFormat: campaign?.priceFormat || 'Unknown',
        campaignName: campaign?.offerName || 'Unknown',
      };
    });

    // Log the enriched data for debugging
    console.log('Enriched Clicks:', enrichedClicks);
    
    // Send response
    res.status(200).json({ success: true, data: enrichedClicks });
  } catch (error) {
    console.error('Error fetching conversions:', error);
    res.status(500).json({ success: false, message: 'Error fetching conversions' });
  }
};

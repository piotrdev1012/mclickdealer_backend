import { Request, Response } from "express";
import TrackingLink from "../models/trackingLink.model";

// Add or update tracking links
export const saveTrackingLinks = async (req: Request, res: Response) => {
//   console.log(req);
  try {
    const {
      campaignId,
      affiliateId,
      advertiserId,
      creativeId,
      domain,
      mediaType,
      subIds,
      udid,
      trackingUrl,
    } = req.body;

    // Validate required fields
    // if (!affiliateId || !offerId || !creativeId || !trackingUrl) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required fields: affiliateId, offerId, creativeId, or trackingUrl",
    //     // console.log(res)
    //   });
    // }

    // Check if the tracking link already exists
    // const existingLink = await TrackingLink.findOne({ affiliateId, offerId, creativeId });

    // if (existingLink) {
    //   // Update the existing link
    //   existingLink.domain = domain;
    //   existingLink.mediaType = mediaType;
    //   existingLink.subIds = subIds;
    //   existingLink.udid = udid;
    //   existingLink.trackingUrl = trackingUrl;

    //   await existingLink.save();

    //   return res.status(200).json({
    //     success: true,
    //     message: "Tracking link updated successfully",
    //     data: existingLink,
    //   });
    // } else {
      // Create a new tracking link
      const newTrackingLink = new TrackingLink({
        campaignId,
        affiliateId,
        advertiserId,
        creativeId,
        domain,
        mediaType,
        subIds,
        udid,
        trackingUrl,
      });

      await newTrackingLink.save();

      return res.status(201).json({
        
        success: true,
        message: "Tracking link created successfully",
        data: newTrackingLink,
      });
    }
  catch (error) {
    console.error("Error saving tracking link:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    //   error: error.message,
    });
  }
};

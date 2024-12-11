import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
    creativeId: string;
    domain: string;
    mediaType: string;
    subIds: {                                     // Sub IDs (optional fields)
        subId1: String,
        subId2: String,
        subId3: String,
        subId4: String,
        subId5: String,
      };
    udid: string;
    fbVerified: boolean;
    trackingUrl: string;
    createdAt: Date;
  }

// Define the schema for tracking links
const TrackingLinkSchema: Schema = new Schema({
  affiliateId: { type: String, required: true }, // Affiliate ID
  advertiserId: { type: String, required: true },     // Offer ID
  campaignId: { type: String, required: true },     // Offer ID
  creativeId: { type: String },  // Creative ID
  domain: { type: String, required: true },      // Domain (e.g., tracking domain)
  mediaType: { type: String },                  // Media type (optional)
  subIds: {                                     // Sub IDs (optional fields)
    subId1: { type: String },
    subId2: { type: String },
    subId3: { type: String },
    subId4: { type: String },
    subId5: { type: String },
  },
  udid: { type: String },                       // Unique Device ID (optional)
  fbVerified: { type: Boolean, default: false },// Facebook verified domains (optional)
  trackingUrl: { type: String, required: true },// Generated tracking URL
  createdAt: { type: Date, default: Date.now }, // Creation date
});

// Create and export the model
const TrackingLink = mongoose.model('TrackingLink', TrackingLinkSchema);
module.exports = TrackingLink;

export default mongoose.model<IToken>("TrackingLink", TrackingLinkSchema);

import { Document, model, Schema } from "mongoose";

// Define the interface for the Offer document
export interface IOfferDocument extends Document {
  advertiserId?: Schema.Types.ObjectId | null;
  offerName: string;
  payout: string;
  priceFormat: string;
  vertical?: string;
  flow?: string;
  platforms?: Array<string>;
  trackingType?: string;
  allowedCountries?: Array<string>;
  blacklistedCountries?: Array<string>;
  imageUrl?: string;
  description?: string;
  restrictions?: string;
  domain?: string;
  mediaType?: Array<string>;
  restrictedMediaType?: Array<string>;
  subaffiliate?: string;
  subId1?: string;
  subId2?: string;
  offerCapped?: boolean;
  age?: string;
  gender?: Array<string>;
  preapproval?: boolean;
  loyalty?: boolean;
  incentivized?: boolean;
  network?: Array<string>;
  adultTraffic?: boolean;
  status?: "pending" | "active" | "declined" | "canceled" | "closed" | "paused";
  carrier?: string;
  postApi?: boolean;
  catalog?: boolean;
  baseUrl?: string; // base URL for tracking
  creatives: Array<{
    creativeId: string;
    imageUrl: string;
    trackingLink: string;
    description: string;
    baseUrl: string;
  }>;
  postbackUrl?: string;
}

// Define the Offer schema
const OfferSchema = new Schema<IOfferDocument>(
  {
    creatives: [
      {
        creativeId: { type: String, required: true }, // Unique identifier for creative
        imageUrl: { type: String, required: true }, // Image URL
        trackingLink: { type: String, required: true }, // Tracking URL for the creative
        description: { type: String, default: '' }, // Optional description
        baseUrl: { type: String, default: '' }, // Base URL for tracking
      },
    ], // Array of creatives
    // Existing fields
    advertiserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    offerName: { type: String, required: true, default: "" },
    payout: { type: String, required: true, default: "" },
    priceFormat: { type: String, required: true, default: "" },
    vertical: { type: String, default: "" },
    flow: { type: String, default: "" },
    blacklistedCountries: { type: Array, default: [] },
    allowedCountries: { type: Array, default: [] },
    trackingType: { type: String, default: "" },
    platforms: { type: Array, default: [] },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    restrictions: { type: String, default: "" },
    domain: { type: String, default: "" },
    mediaType: { type: Array, default: [] },
    restrictedMediaType: { type: Array, default: [] },
    subaffiliate: { type: String, default: "" },
    subId1: { type: String, default: "" },
    subId2: { type: String, default: "" },
    offerCapped: { type: Boolean, default: false },
    age: { type: String, default: "" },
    gender: { type: Array, default: [] },
    preapproval: { type: Boolean, default: false },
    loyalty: { type: Boolean, default: false },
    incentivized: { type: Boolean, default: false },
    network: { type: Array, default: [] },
    adultTraffic: { type: Boolean, default: false },
    status: { type: String, default: "active", enum: ["pending", "canceled", "active", "closed", "paused", "declined"], },
    carrier: { type: String, default: "" },
    postApi: { type: Boolean, default: false },
    catalog: { type: Boolean, default: false },
    baseUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Add method to build the postback URL
OfferSchema.methods.buildPostbackUrl = function (creativeId: string, additionalParams: Record<string, string> = {}) {
  const offer = this; // Reference to the current offer document
  const creative = offer.creatives.find((c) => c.creativeId === creativeId); // Find the creative by ID

  if (!creative) {
    throw new Error('Creative not found');
  }

  // Base URL (this could be the `baseUrl` field in the offer model or a predefined URL)
  let postbackUrl = creative.baseUrl || offer.baseUrl;

  // Add static parameters from the offer model
  const params = {
    affiliateId: offer.affiliateId?.toString() || '',
    offerName: offer.offerName,
    payout: offer.payout,
    priceFormat: offer.priceFormat,
    trackingLink: creative.trackingLink,
    ...additionalParams, // Allow dynamic parameters to be added
  };

  // Construct the query string
  const queryString = new URLSearchParams(params).toString();

  // Return the postback URL
  return `${postbackUrl}?${queryString}`;
};

const Offer = model<IOfferDocument>("Offer", OfferSchema);
export default Offer;

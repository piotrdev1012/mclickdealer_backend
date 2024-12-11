import mongoose, { Document, model, Schema } from "mongoose";
import { IOfferDocument } from "./offer.model";
import { IUserDocument } from "./user.model";

export interface ICampaignDocument extends Document {
  // id:string;
  advertiserId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IUserDocument> |null;
  affiliateId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IUserDocument> | null;
  offerId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IOfferDocument> | null;
  status: "pending" | "active" | "declined" | "canceled" | "closed" | "paused";
  priceFormat: string;
  offerName: string;
}

const CampaignSchema = new Schema<ICampaignDocument>(
  {
    // id: { type: String, required: true },
    advertiserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    affiliateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    priceFormat: { type: String, required: true, default: "" },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "canceled", "active", "closed", "paused", "declined"],
      required: true,
    },
    offerName: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

const Campaign = model<ICampaignDocument>("Campaign", CampaignSchema);
export default Campaign;

import mongoose, { Schema, Document, model } from "mongoose";
import { IUserDocument } from "./user.model";
import { ICampaignDocument } from "./campaign.model";
import { IClick } from "./click.model";
import { IConversion } from "./conversion.model";

export interface ITransaction extends Document {
  userId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IUserDocument> |null;
  type: "withdrawl" | "deposit" | "contract";
  amount: number;
  date: Date;
  status: "approved" | "rejected" | "pending" | "payout" | "payin";
  campaignId: Schema.Types.ObjectId | mongoose.PopulatedDoc<ICampaignDocument> |null;
  clickId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IClick> |null;
  conversionId: Schema.Types.ObjectId | mongoose.PopulatedDoc<IConversion> |null;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: null,
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
    default: null,
  },
  clickId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
    default: null,
  },
  conversionId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: true,
    enum: ["withdrawl", "deposit", "payout", "payin"]
  },
  status: {
    type: String,
    default: "pending",
    enum: [ "approved", "rejected", "pending", "canceled"],
  },
  amount: { type: Number },
  date: { type: Date },
});

const Transaction = model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;

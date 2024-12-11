import mongoose, { Schema, Document } from 'mongoose';

export interface IClick extends Document {
  campaignId: string;
  affiliateId: string;
  advertiserId: string;
  timestamp: Date;
  IP: string;
  device: string;
  geo: string;
  status?: "pending" | "approved" | "rejected";
}

const ClickSchema: Schema = new Schema({
  campaignId: { type: String },
  affiliateId: { type: String},
  advertiserId: { type: String},
  timestamp: { type: Date, default: Date.now },
  IP: { type: String, required: true },
  device: { type: String, required: true },
  geo: { type: String, default: 'unknown' },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"], },
});

export default mongoose.model<IClick>('Click', ClickSchema);

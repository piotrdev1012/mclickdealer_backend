import mongoose, { Schema, Document } from 'mongoose';

export interface IConversion extends Document {
  conversionId: string;
  campaignId: string;
  affiliateId: string;
  advertiserId: string;
  price: number;
  status: string;
  timestamp: Date;
}

const ConversionSchema: Schema = new Schema({
  conversionId: { type: String },
  campaignId: { type: String, required: true },
  affiliateId: { type: String, required: true },
  advertiserId: { type: String, required: true },
  price: { type: Number },
  status: { type: String, default: 'approved' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IConversion>('Conversion', ConversionSchema);

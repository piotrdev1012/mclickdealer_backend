import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  tokenName: string;
  placeholder: string;
}

const TokenSchema: Schema = new Schema({
  tokenName: { type: String, required: true },
  placeholder: { type: String, required: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);

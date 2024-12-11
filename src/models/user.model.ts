import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
export interface IUserDocument extends Document {
  role: string;
  accountName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  balance: number;
  specialization: string;
  preferredNiche: string;
  verifyCodeToken?: string;
  isEmailVerify?: boolean;
}

const UserSchema = new Schema<IUserDocument>(
  {
    role: { type: String, required: true, default: "user" },
    accountName: { type: String, required: true, default: "", unique: true },
    firstName: { type: String, required: true, default: "" },
    lastName: { type: String, required: true, default: "" },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    balance: { type: Number, default: 0},
    specialization: { type: String, required: true },
    preferredNiche: { type: String, required: true },
    verifyCodeToken: { type: String, default: "" },
    isEmailVerify: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error as any);
  }
});

const User = model<IUserDocument>("User", UserSchema);
User.createIndexes();
export default User;

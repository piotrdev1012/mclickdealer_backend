import { Document, model, Schema } from "mongoose";
export interface IScheduleDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  statTime?: string;
  endTime?: string;
  dentistId?: string;
  address?: string;
  phone?: string;
}

const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    dentistId: { type: String, required: true },
    firstName: { type: String, required: true, default: "" },
    lastName: { type: String, required: true, default: "" },
    email: { type: String, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

const Schedule = model<IScheduleDocument>("Schedule", ScheduleSchema);
export default Schedule;

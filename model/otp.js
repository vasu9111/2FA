import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date },
    otpExpiry: { type: Date, required: true },
  },
  { versionKey: false }
);

export default mongoose.model("OTP", otpSchema);

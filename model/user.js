import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is2FAEnabled: { type: Boolean, default: false },
    secret: { type: String, default: null },
    twoFactorMode: { type: String, default: null },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);

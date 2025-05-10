import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is2FAEnabled: { type: Boolean },
    secret: { type: String, default: "" },
    twoFactorMode: {
      type: String,
      enum: ["APP", "EMAIL"],
      default: "APP",
    },
  },
  { versionKey: false }
);

export default mongoose.model("user", userSchema);

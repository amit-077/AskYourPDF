import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  goldUser: {
    // If user pays for plan 1
    type: Boolean,
    default: false,
  },
  premiumUser: {
    // If user pays for plan 2
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenEpiry: Date,
});

const User = mongoose.models?.users || mongoose.model("users", userSchema);

export default User;

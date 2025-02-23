const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpStatus: {
    type: String,
    enum: ["pending", "verified", "expired"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
  },
});

module.exports = mongoose.model("OtpModel", otpSchema);

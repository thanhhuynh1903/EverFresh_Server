const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 255,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your email."],
      unique: [true, "Email address has already taken."],
    },
    phone_number: {
      type: String,
      maxLength: 10,
    },
    country: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    role: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: Number,
    },
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const linkedInformationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
      unique: true,
    },
    expiration_date: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LinkedInformation", linkedInformationSchema);

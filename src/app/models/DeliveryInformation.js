const mongoose = require("mongoose");

const deliveryInformationSchema = mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    address_detail: {
      type: String,
      required: true,
    },
    is_default: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DeliveryInformation",
  deliveryInformationSchema
);

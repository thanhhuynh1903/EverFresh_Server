const mongoose = require("mongoose");

const deliveryMethodSchema = mongoose.Schema(
  {
    delivery_method_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeliveryMethod", deliveryMethodSchema);

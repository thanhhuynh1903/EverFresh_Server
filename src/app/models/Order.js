const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    payment_method: {
      type: String,
      required: true,
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    delivery_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMethod",
      required: true,
    },
    delivery_information_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryInformation",
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

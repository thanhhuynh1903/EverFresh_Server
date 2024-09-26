const { type } = require("jquery");
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    delivery_method: {
      delivery_method_name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    delivery_information: {
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
    },
    total_price: {
      type: Number,
      required: true,
    },
    list_cart_item_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
        required: true,
      },
    ],
    delivered_date: {
      type: Date,
    },
    failed_delivery_note: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

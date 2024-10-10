const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    product: {
      type: Object,
    },
    custom_color: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    item_total_price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CartItem", cartItemSchema);

const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema(
  {
    plant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
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

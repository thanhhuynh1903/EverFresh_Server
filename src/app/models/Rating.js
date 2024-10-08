const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
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
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    star: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", ratingSchema);

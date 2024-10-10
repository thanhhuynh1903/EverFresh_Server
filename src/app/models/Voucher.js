const mongoose = require("mongoose");

const voucherSchema = mongoose.Schema(
  {
    voucher_code: {
      type: String,
      required: true,
    },
    voucher_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_day: {
      type: Date,
      required: true,
    },
    end_day: {
      type: Date,
      required: true,
    },
    is_percent: {
      type: Boolean,
      required: true,
    },
    voucher_discount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

module.exports = mongoose.model("Voucher", voucherSchema);

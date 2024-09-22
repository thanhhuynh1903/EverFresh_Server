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
    voucher_discount: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", voucherSchema);

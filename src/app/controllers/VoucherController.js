const Voucher = require("../models/Voucher");
const asyncHandler = require("express-async-handler");

// Create a new Voucher
const createVoucher = asyncHandler(async (req, res) => {
  try {
    const {
      voucher_code,
      voucher_name,
      description,
      start_day,
      end_day,
      voucher_discount,
    } = req.body;

    if (
      !voucher_code ||
      !voucher_name ||
      !start_day ||
      !end_day ||
      !voucher_discount
    ) {
      res.status(400);
      throw new Error("All fields are required except description");
    }

    const existingVoucher = await Voucher.findOne({ voucher_code });
    if (existingVoucher) {
      res.status(400);
      throw new Error("Voucher code already exists");
    }

    const newVoucher = new Voucher({
      voucher_code,
      voucher_name,
      description,
      start_day,
      end_day,
      voucher_discount,
    });
    await newVoucher.save();

    res.status(201).json(newVoucher);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all Vouchers
const getAllVouchers = asyncHandler(async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single Voucher by ID
const getVoucherById = asyncHandler(async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      res.status(404);
      throw new Error("Voucher not found");
    }
    res.status(200).json(voucher);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update a Voucher by ID
const updateVoucher = asyncHandler(async (req, res) => {
  try {
    const {
      voucher_code,
      voucher_name,
      description,
      start_day,
      end_day,
      voucher_discount,
    } = req.body;

    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      res.status(404);
      throw new Error("Voucher not found");
    }

    // Check if voucher code is being changed and if it already exists
    if (voucher_code && voucher_code !== voucher.voucher_code) {
      const existingVoucher = await Voucher.findOne({ voucher_code });
      if (existingVoucher) {
        res.status(400);
        throw new Error("Voucher code already exists");
      }
    }

    voucher.voucher_code = voucher_code || voucher.voucher_code;
    voucher.voucher_name = voucher_name || voucher.voucher_name;
    voucher.description = description || voucher.description;
    voucher.start_day = start_day || voucher.start_day;
    voucher.end_day = end_day || voucher.end_day;
    voucher.voucher_discount = voucher_discount || voucher.voucher_discount;

    await voucher.save();

    res.status(200).json(voucher);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete a Voucher by ID
const deleteVoucher = asyncHandler(async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      res.status(404);
      throw new Error("Voucher not found");
    }

    await voucher.remove();
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
};

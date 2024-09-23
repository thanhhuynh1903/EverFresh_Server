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

    // Check if voucher with the same code already exists
    const existingVoucher = await Voucher.findOne({ voucher_code });
    if (existingVoucher) {
      return res.status(400).json({ message: "Voucher code already exists." });
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
    res.status(500).json({ message: error.message });
  }
});

// Get all Vouchers
const getAllVouchers = asyncHandler(async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single Voucher by ID
const getVoucherById = asyncHandler(async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Voucher not found" });
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
    res.status(500).json({ message: error.message });
  }
});

// Delete a Voucher by ID
const deleteVoucher = asyncHandler(async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    await voucher.remove();
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
};

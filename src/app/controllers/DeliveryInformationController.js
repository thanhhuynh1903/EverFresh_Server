const DeliveryInformation = require("../models/DeliveryInformation");
const asyncHandler = require("express-async-handler");

// Create new Delivery Information
const createDeliveryInformation = asyncHandler(async (req, res) => {
  try {
    const { phone_number, address, address_detail } = req.body;

    const existingDeliveryInfo = await DeliveryInformation.findOne({
      user_id: req.user.id,
    });

    const newDeliveryInfo = new DeliveryInformation({
      phone_number,
      address,
      address_detail,
      is_default: !existingDeliveryInfo, // Set to true if no existing info
      user_id: req.user.id,
    });

    await newDeliveryInfo.save();
    res.status(201).json(newDeliveryInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all Delivery Information for the logged-in customer
const getAllDeliveryInformation = asyncHandler(async (req, res) => {
  try {
    const deliveryInfoList = await DeliveryInformation.find({
      user_id: req.user.id,
    });
    res.status(200).json(deliveryInfoList);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single Delivery Information by ID for the logged-in customer
const getDeliveryInformationById = asyncHandler(async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInformation.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deliveryInfo) {
      res.status(404);
      throw new Error("Delivery information not found");
    }

    res.status(200).json(deliveryInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update Delivery Information by ID
const updateDeliveryInformation = asyncHandler(async (req, res) => {
  try {
    const { phone_number, address, address_detail } = req.body;

    const deliveryInfo = await DeliveryInformation.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deliveryInfo) {
      res.status(404);
      throw new Error("Delivery information not found");
    }

    deliveryInfo.phone_number = phone_number || deliveryInfo.phone_number;
    deliveryInfo.address = address || deliveryInfo.address;
    deliveryInfo.address_detail = address_detail || deliveryInfo.address_detail;

    await deliveryInfo.save();

    res.status(200).json(deliveryInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update Delivery Information Is Default Location by ID
const updateDeliveryInformationDefault = asyncHandler(async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInformation.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deliveryInfo) {
      res.status(404);
      throw new Error("Delivery information not found");
    }

    // Set all delivery information to non-default
    await DeliveryInformation.updateMany(
      { user_id: req.user.id },
      { $set: { is_default: false } }
    );

    // Set the selected delivery information to default
    deliveryInfo.is_default = true;
    await deliveryInfo.save();

    res.status(200).json(deliveryInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete Delivery Information by ID
const deleteDeliveryInformation = asyncHandler(async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInformation.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deliveryInfo) {
      res.status(404);
      throw new Error("Delivery information not found");
    }

    await deliveryInfo.remove();
    res
      .status(200)
      .json({ message: "Delivery information deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createDeliveryInformation,
  getAllDeliveryInformation,
  getDeliveryInformationById,
  updateDeliveryInformation,
  updateDeliveryInformationDefault,
  deleteDeliveryInformation,
};

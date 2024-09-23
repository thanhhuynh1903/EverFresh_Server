const DeliveryInformation = require("../models/DeliveryInformation");
const asyncHandler = require("express-async-handler");

// Create new Delivery Information
const createDeliveryInformation = asyncHandler(async (req, res) => {
  try {
    const { phone_number, address, address_detail } = req.body;

    const checkExistDeliveryInformation = await DeliveryInformation.findOne({
      user_id: req.user.id,
    });
    if (!checkExistDeliveryInformation) {
      const newDeliveryInfo = new DeliveryInformation({
        phone_number,
        address,
        address_detail,
        is_default: true,
        user_id: req.user.id,
      });

      await newDeliveryInfo.save();
      res.status(201).json(newDeliveryInfo);
    } else {
      const newDeliveryInfo = new DeliveryInformation({
        phone_number,
        address,
        address_detail,
        is_default: false,
        user_id: req.user.id,
      });

      await newDeliveryInfo.save();
      res.status(201).json(newDeliveryInfo);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
      return res
        .status(404)
        .json({ message: "Delivery information not found" });
    }

    res.status(200).json(deliveryInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res
        .status(404)
        .json({ message: "Delivery information not found" });
    }

    deliveryInfo.phone_number = phone_number || deliveryInfo.phone_number;
    deliveryInfo.address = address || deliveryInfo.address;
    deliveryInfo.address_detail = address_detail || deliveryInfo.address_detail;

    await deliveryInfo.save();

    res.status(200).json(deliveryInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res
        .status(404)
        .json({ message: "Delivery information not found" });
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
    res.status(500).json({ message: error.message });
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
      return res
        .status(404)
        .json({ message: "Delivery information not found" });
    }

    await deliveryInfo.remove();
    res
      .status(200)
      .json({ message: "Delivery information deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

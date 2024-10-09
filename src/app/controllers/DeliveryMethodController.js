const DeliveryMethod = require("../models/DeliveryMethod");
const asyncHandler = require("express-async-handler");

// Create a new DeliveryMethod
const createDeliveryMethod = asyncHandler(async (req, res) => {
  try {
    const { delivery_method_name, price } = req.body;

    // Check if delivery method with the same name already exists
    const existingMethod = await DeliveryMethod.findOne({
      delivery_method_name,
    });
    if (existingMethod) {
      res.status(400);
      throw new Error("Delivery method already exists.");
    }

    const newMethod = new DeliveryMethod({ delivery_method_name, price });
    await newMethod.save();

    res.status(201).json(newMethod);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all DeliveryMethods
const getAllDeliveryMethods = asyncHandler(async (req, res) => {
  try {
    const methods = await DeliveryMethod.find();
    res.status(200).json(methods);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single DeliveryMethod by ID
const getDeliveryMethodById = asyncHandler(async (req, res) => {
  try {
    const method = await DeliveryMethod.findById(req.params.id);
    if (!method) {
      res.status(404);
      throw new Error("Delivery method not found");
    }
    res.status(200).json(method);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update a DeliveryMethod by ID
const updateDeliveryMethod = asyncHandler(async (req, res) => {
  try {
    const { delivery_method_name, price } = req.body;
    const method = await DeliveryMethod.findById(req.params.id);

    if (!method) {
      res.status(404);
      throw new Error("Delivery method not found");
    }

    if (delivery_method_name) {
      const existingMethod = await DeliveryMethod.findOne({
        delivery_method_name,
      });
      if (existingMethod) {
        res.status(400);
        throw new Error("Delivery method already exists.");
      }
      method.delivery_method_name = delivery_method_name;
    }

    method.price = price || method.price;

    await method.save();

    res.status(200).json(method);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete a DeliveryMethod by ID
const deleteDeliveryMethod = asyncHandler(async (req, res) => {
  try {
    const method = await DeliveryMethod.findById(req.params.id);

    if (!method) {
      res.status(404);
      throw new Error("Delivery method not found");
    }

    await method.remove();
    res.status(200).json({ message: "Delivery method deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createDeliveryMethod,
  getAllDeliveryMethods,
  getDeliveryMethodById,
  updateDeliveryMethod,
  deleteDeliveryMethod,
};

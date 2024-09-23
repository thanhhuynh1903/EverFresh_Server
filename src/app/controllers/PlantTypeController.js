const PlantType = require("../models/PlantType");
const asyncHandler = require("express-async-handler");

// Create a new PlantType
const createPlantType = asyncHandler(async (req, res) => {
  try {
    const { plant_type_name } = req.body;

    if (!plant_type_name) {
      res.status(400);
      throw new Error("Plant type name is required");
    }

    const existingPlantType = await PlantType.findOne({ plant_type_name });
    if (existingPlantType) {
      res.status(400);
      throw new Error("Plant type already exists");
    }

    const newPlantType = new PlantType({ plant_type_name });
    await newPlantType.save();

    res.status(201).json(newPlantType);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all PlantTypes
const getAllPlantTypes = asyncHandler(async (req, res) => {
  try {
    const plantTypes = await PlantType.find();
    res.status(200).json(plantTypes);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single PlantType by ID
const getPlantTypeById = asyncHandler(async (req, res) => {
  try {
    const plantType = await PlantType.findById(req.params.id);
    if (!plantType) {
      res.status(404);
      throw new Error("Plant type not found");
    }
    res.status(200).json(plantType);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update a PlantType by ID
const updatePlantType = asyncHandler(async (req, res) => {
  try {
    const { plant_type_name } = req.body;

    if (!plant_type_name) {
      res.status(400);
      throw new Error("Plant type name is required for update");
    }

    const plantType = await PlantType.findById(req.params.id);
    if (!plantType) {
      res.status(404);
      throw new Error("Plant type not found");
    }

    plantType.plant_type_name = plant_type_name;
    await plantType.save();

    res.status(200).json(plantType);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete a PlantType by ID
const deletePlantType = asyncHandler(async (req, res) => {
  try {
    const plantType = await PlantType.findById(req.params.id);
    if (!plantType) {
      res.status(404);
      throw new Error("Plant type not found");
    }

    await plantType.remove();
    res.status(200).json({ message: "Plant type deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createPlantType,
  getAllPlantTypes,
  getPlantTypeById,
  updatePlantType,
  deletePlantType,
};

const Genus = require("../models/Genus");
const asyncHandler = require("express-async-handler");

// Create a new Genus
const createGenus = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    // Check if genus with the same name already exists
    const existingGenus = await Genus.findOne({ name });
    if (existingGenus) {
      res.status(400);
      throw new Error("Genus already exists.");
    }

    const newGenus = new Genus({ name });
    await newGenus.save();

    res.status(201).json(newGenus);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all Genus
const getAllGenus = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.find();
    res.status(200).json(genus);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single Genus by ID
const getGenusById = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.findById(req.params.id);
    if (!genus) {
      res.status(404);
      throw new Error("Genus not found");
    }
    res.status(200).json(genus);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update a Genus by ID
const updateGenus = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const genus = await Genus.findById(req.params.id);

    if (!genus) {
      res.status(404);
      throw new Error("Genus not found");
    }

    genus.name = name || genus.name;
    await genus.save();

    res.status(200).json(genus);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete a Genus by ID
const deleteGenus = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.findById(req.params.id);

    if (!genus) {
      res.status(404);
      throw new Error("Genus not found");
    }

    await genus.remove();
    res.status(200).json({ message: "Genus deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createGenus,
  getAllGenus,
  getGenusById,
  updateGenus,
  deleteGenus,
};

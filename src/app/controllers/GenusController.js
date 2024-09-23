const Genus = require("../models/Genus");
const asyncHandler = require("express-async-handler");

// Create a new Genus
const createGenus = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    // Check if genus with the same name already exists
    const existingGenus = await Genus.findOne({ name });
    if (existingGenus) {
      return res.status(400).json({ message: "Genus already exists." });
    }

    const newGenus = new Genus({ name });
    await newGenus.save();

    res.status(201).json(newGenus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all Genus
const getAllGenus = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.find();
    res.status(200).json(genus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single Genus by ID
const getGenusById = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.findById(req.params.id);
    if (!genus) {
      return res.status(404).json({ message: "Genus not found" });
    }
    res.status(200).json(genus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Genus by ID
const updateGenus = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const genus = await Genus.findById(req.params.id);

    if (!genus) {
      return res.status(404).json({ message: "Genus not found" });
    }

    genus.name = name || genus.name;
    await genus.save();

    res.status(200).json(genus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Genus by ID
const deleteGenus = asyncHandler(async (req, res) => {
  try {
    const genus = await Genus.findById(req.params.id);

    if (!genus) {
      return res.status(404).json({ message: "Genus not found" });
    }

    await genus.remove();
    res.status(200).json({ message: "Genus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createGenus,
  getAllGenus,
  getGenusById,
  updateGenus,
  deleteGenus,
};

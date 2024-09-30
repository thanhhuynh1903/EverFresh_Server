const asyncHandler = require("express-async-handler");
const RoleEnum = require("../../enum/RoleEnum");
const Plant = require("../models/Plant");
const moment = require("moment");
const PlantStatusEnum = require("../../enum/PlantStatusEnum");

// @desc Create new Plant
// @route POST /plants
// @access Private
const createPlant = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có quyền tạo Plant");
    }

    const { name, genus_id, img_url, plant_type_id, price, quantity } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !genus_id ||
      !img_url ||
      !plant_type_id ||
      !price ||
      !quantity
    ) {
      res.status(400);
      throw new Error("Các thuộc tính bắt buộc không được để trống");
    }

    // Create new plant object
    const plant = new Plant(req.body);
    plant.status = PlantStatusEnum.IN_STOCK;

    const newPlant = await plant.save();
    res.status(201).json(newPlant);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Get Plant by ID
// @route GET /plants/:plant_id
// @access Private
const getPlantById = asyncHandler(async (req, res) => {
  try {
    const plantId = req.params.plant_id;
    const plant = await Plant.findById(plantId)
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!plant) {
      res.status(404);
      throw new Error("Không tìm thấy Plant");
    }
    res.status(200).json(plant);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Get all Plants for guest
// @route GET /plants/guest
// @access Public
const getPlants = asyncHandler(async (req, res) => {
  try {
    const plants = await Plant.find()
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!plants) {
      res.status(400);
      throw new Error("Có lỗi xảy ra khi truy xuất tất cả Plant");
    }
    res.status(200).json(plants);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Update Plant
// @route PUT /plants/:plant_id
// @access Private
const updatePlant = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có quyền thay đổi thông tin Plant");
    }

    const plantId = req.params.plant_id;

    // Find the plant by ID
    const plant = await Plant.findById(plantId);
    if (!plant) {
      res.status(404);
      throw new Error("Không tìm thấy Plant");
    }

    const updatedFields = req.body;

    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    )
      .populate("genus_id")
      .populate("plant_type_id");

    if (!updatedPlant) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi cập nhật thông tin Plant");
    }

    // Return the updated plant
    res.status(200).json(updatedPlant);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Search Plant by Name
// @route GET /plants/search
// @access Public
const searchPlantByName = asyncHandler(async (req, res) => {
  try {
    const searchName = req.query.searchName;
    if (!searchName) {
      res.status(400);
      throw new Error("Tên Plant không được trống");
    }

    const plants = await Plant.find({
      name: { $regex: searchName, $options: "i" },
    })
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!plants) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm kiếm Plant");
    }

    res.status(200).json(plants);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Delete Plant
// @route DELETE /plants/:plant_id
// @access Private
const deletePlant = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có thể xóa Plant");
    }

    const plantId = req.params.plant_id;
    const plant = await Plant.findById(plantId);
    if (!plant) {
      res.status(404);
      throw new Error("Không tìm thấy Plant");
    }

    const deletePlant = await Plant.findByIdAndDelete(plantId);
    if (!deletePlant) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xóa Plant");
    }

    res.status(200).send("Plant đã xóa thành công");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createPlant,
  getPlantById,
  getPlants,
  updatePlant,
  searchPlantByName,
  deletePlant,
};

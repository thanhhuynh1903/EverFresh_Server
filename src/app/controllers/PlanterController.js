const PlantStatusEnum = require("../../enum/PlantStatusEnum");
const Planter = require("../models/Planter");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get all planters
 * @route GET /api/planters
 * @access Private
 */
const getPlanters = asyncHandler(async (req, res) => {
  try {
    const planters = await Planter.find();
    if (!planters) {
      res.status(404);
      throw new Error("No planters found");
    }
    res.status(200).json(planters);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Get a planter by ID
 * @route GET /api/planters/:id
 * @access Private
 */
const getPlanterById = asyncHandler(async (req, res) => {
  try {
    const planter = await Planter.findById(req.params.id);
    if (!planter) {
      res.status(404);
      throw new Error("Planter not found");
    }
    res.status(200).json(planter);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create a new planter
 * @route POST /api/planters
 * @access Private
 */
const createPlanter = asyncHandler(async (req, res) => {
  try {
    const { name, category, img_object, price } = req.body;
    if (!name || !category || !img_object || !price) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (price < 0) {
      res.status(400);
      throw new Error("Invalid price");
    }
    const planter = new Planter(req.body);
    const createdPlanter = await planter.save();
    res.status(201).json(createdPlanter);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a planter by ID
 * @route PUT /api/planters/:id
 * @access Private
 */
const updatePlanter = asyncHandler(async (req, res) => {
  try {
    const planter = await Planter.findById(req.params.id);
    if (!planter) {
      res.status(404);
      throw new Error("Planter not found");
    }
    if (req.body.price && req.body.price < 0) {
      res.status(400);
      throw new Error("Invalid price");
    }
    Object.assign(planter, req.body);
    const updatedPlanter = await planter.save();
    res.status(200).json(updatedPlanter);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a planter by ID
 * @route PUT /api/planters/:id
 * @access Private
 */
const updatePlanterStatus = asyncHandler(async (req, res) => {
  try {
    const planter = await Planter.findById(req.params.id);
    if (!planter) {
      res.status(404);
      throw new Error("Planter not found");
    }

    const { status } = req.body;
    switch (status) {
      case PlantStatusEnum.IN_STOCK: {
        const updatedPlanter = await Planter.findByIdAndUpdate(
          req.params.id,
          { status: PlantStatusEnum.IN_STOCK },
          { new: true }
        );

        res.status(200).json(updatedPlanter);
        break;
      }
      case PlantStatusEnum.OUT_OF_STOCK: {
        const updatedPlanter = await Planter.findByIdAndUpdate(
          req.params.id,
          { status: PlantStatusEnum.OUT_OF_STOCK },
          { new: true }
        );

        res.status(200).json(updatedPlanter);
        break;
      }
      default: {
        res.status(400);
        throw new Error("Status is not supported");
      }
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Search Plant by Name
// @route GET /plants/search
// @access Public
const searchPlanterByName = asyncHandler(async (req, res) => {
  try {
    const searchName = req.query.searchName;
    if (!searchName) {
      res.status(400);
      throw new Error("Tên Planter không được trống");
    }

    const planters = await Planter.find({
      name: { $regex: searchName, $options: "i" },
    }).exec();

    if (!planters) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm kiếm Planter");
    }

    res.status(200).json(planters);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Delete a planter by ID
 * @route DELETE /api/planters/:id
 * @access Private
 */
const deletePlanter = asyncHandler(async (req, res) => {
  try {
    const planter = await Planter.findById(req.params.id);
    if (!planter) {
      res.status(404);
      throw new Error("Planter not found");
    }

    await planter.remove();
    res.status(200).json({ message: "Planter removed" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getPlanters,
  getPlanterById,
  createPlanter,
  updatePlanter,
  updatePlanterStatus,
  searchPlanterByName,
  deletePlanter,
};

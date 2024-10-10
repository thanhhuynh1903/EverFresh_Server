const asyncHandler = require("express-async-handler");
const RoleEnum = require("../../enum/RoleEnum");
const moment = require("moment");
const PlantStatusEnum = require("../../enum/PlantStatusEnum");
const Genus = require("../models/Genus");
const PlantType = require("../models/PlantType");
const Seed = require("../models/Seed");
const NotificationTypeEnum = require("../../enum/NotificationTypeEnum");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc Create new seed
// @route POST /seeds
// @access Private
const createSeed = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có quyền tạo Seed");
    }

    const { name, genus_id, img_url, plant_type_id, price } = req.body;

    if (!name || !genus_id || !img_url || !plant_type_id || !price) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (price < 0) {
      res.status(400);
      throw new Error("Price must be greater than zero");
    }

    const genus = await Genus.findById(genus_id);
    if (!genus) {
      res.status(404);
      throw new Error("Genus not found");
    }

    const plantType = await PlantType.findById(plant_type_id);
    if (!plantType) {
      res.status(404);
      throw new Error("Plant Type not found");
    }

    // Create new seed object
    const seed = new Seed(req.body);
    seed.status = PlantStatusEnum.IN_STOCK;
    const newSeed = await seed.save();

    setImmediate(async () => {
      try {
        const customers = await User.find({
          role: RoleEnum.CUSTOMER,
          status: true,
        });

        if (customers.length > 0) {
          const notifications = customers.map((customer) => ({
            user_id: customer._id,
            description: "Our shop have updated more seeds",
            type: NotificationTypeEnum.NEW_SEED,
          }));

          await Notification.insertMany(notifications);

          for (const customer of customers) {
            const userNotifications = await Notification.find({
              user_id: customer._id,
            }).sort({ createdAt: -1 });
            _io.emit(`notifications-${customer._id}`, userNotifications);
          }
        }
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    });

    res.status(201).json(newSeed);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Get Seed by ID
// @route GET /seeds/:Seed_id
// @access Private
const getSeedById = asyncHandler(async (req, res) => {
  try {
    const seedId = req.params.seed_id;
    const seed = await Seed.findById(seedId)
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!seed) {
      res.status(404);
      throw new Error("Không tìm thấy Seed");
    }
    res.status(200).json(seed);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Get all seed for guest
// @route GET /seeds/guest
// @access Public
const getSeeds = asyncHandler(async (req, res) => {
  try {
    const seeds = await Seed.find()
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!seeds) {
      res.status(400);
      throw new Error("Có lỗi xảy ra khi truy xuất tất cả Seed");
    }
    res.status(200).json(seeds);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Update seed
// @route PUT /seeds/:seed_id
// @access Private
const updateSeed = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có quyền thay đổi thông tin Seed");
    }

    const seedId = req.params.seed_id;

    // Find the seed by ID
    const seed = await Seed.findById(seedId);
    if (!seed) {
      res.status(404);
      throw new Error("Không tìm thấy Seed");
    }

    const updatedFields = req.body;

    if (updatedFields.price < 0) {
      res.status(400);
      throw new Error("price must be greater than zero");
    }

    if (updatedFields.genus_id) {
      const genus = await Genus.findById(updatedFields.genus_id);
      if (!genus) {
        res.status(404);
        throw new Error("Genus not found");
      }
    }

    if (updatedFields.plant_type_id) {
      const plantType = await PlantType.findById(updatedFields.plant_type_id);
      if (!plantType) {
        res.status(404);
        throw new Error("Plant type not found");
      }
    }

    const updatedSeed = await Seed.findByIdAndUpdate(
      seedId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    )
      .populate("genus_id")
      .populate("plant_type_id");

    if (!updatedSeed) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi cập nhật thông tin Seed");
    }

    // Return the updated plant
    res.status(200).json(updatedSeed);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// @desc Search seed by Name
// @route GET /seeds/search
// @access Public
const searchSeedByName = asyncHandler(async (req, res) => {
  try {
    const searchName = req.query.searchName;
    if (!searchName) {
      res.status(400);
      throw new Error("Tên Plant không được trống");
    }

    const seeds = await Seed.find({
      name: { $regex: searchName, $options: "i" },
    })
      .populate("genus_id")
      .populate("plant_type_id")
      .exec();

    if (!seeds) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm kiếm Seed");
    }

    res.status(200).json(seeds);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const updateSeedStatus = asyncHandler(async (req, res) => {
  try {
    const seed = await Seed.findById(req.params.id);
    if (!seed) {
      res.status(404);
      throw new Error("Seed not found");
    }

    const { status } = req.body;
    switch (status) {
      case PlantStatusEnum.IN_STOCK: {
        const updatedSeed = await Seed.findByIdAndUpdate(
          req.params.id,
          { status: PlantStatusEnum.IN_STOCK },
          { new: true }
        );

        res.status(200).json(updatedSeed);
        break;
      }
      case PlantStatusEnum.OUT_OF_STOCK: {
        const updatedSeed = await Seed.findByIdAndUpdate(
          req.params.id,
          { status: PlantStatusEnum.OUT_OF_STOCK },
          { new: true }
        );

        res.status(200).json(updatedSeed);
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

// @desc Delete seed
// @route DELETE /seeds/:seed_id
// @access Private
const deleteSeed = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("Chỉ có Admin mới có thể xóa Seed");
    }

    const seedId = req.params.seed_id;
    const seed = await Seed.findById(seedId);
    if (!seed) {
      res.status(404);
      throw new Error("Không tìm thấy Seed");
    }

    const deleteSeed = await Seed.findByIdAndDelete(seedId);
    if (!deleteSeed) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xóa Seed");
    }

    res.status(200).send("Seed đã xóa thành công");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createSeed,
  getSeedById,
  getSeeds,
  updateSeed,
  searchSeedByName,
  updateSeedStatus,
  deleteSeed,
};

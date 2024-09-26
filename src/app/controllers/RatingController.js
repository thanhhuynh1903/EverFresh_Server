const Order = require("../models/Order");
const Plant = require("../models/Plant");
const Rating = require("../models/Rating");
const asyncHandler = require("express-async-handler");
const OrderStatusEnum = require("../../enum/OrderStatusEnum");

// Helper to calculate and update the average rating of a plant
const updateAverageRating = async (plantId) => {
  const ratings = await Rating.find({ plant_id: plantId });
  if (ratings.length === 0) {
    await Plant.findByIdAndUpdate(plantId, { average_rating: 0 });
  } else {
    const average = (
      ratings.reduce((acc, rating) => acc + parseInt(rating.star), 0) /
      ratings.length
    ).toFixed(1);
    await Plant.findByIdAndUpdate(plantId, { average_rating: average });
  }
};

/**
 * @desc Get all ratings for a plant
 * @route GET /api/ratings/:plant_id
 * @access Public
 */
const getAllRatingsForPlant = asyncHandler(async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plant_id);
    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    const ratings = await Rating.find({
      plant_id: req.params.plant_id,
    }).populate("user_id");

    res.status(200).json(ratings);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Get all ratings for a plant
 * @route GET /api/ratings/:plant_id
 * @access Public
 */
const getAllRatingsOfOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const ratings = await Rating.find({
      order_id: req.params.order_id,
      user_id: req.user.id,
    }).populate("plant_id");

    res.status(200).json(ratings);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create a new rating
 * @route POST /api/ratings
 * @access Private
 */
const createRating = asyncHandler(async (req, res) => {
  try {
    const { order_id, plant_id, star, comment } = req.body;

    if (!order_id || !plant_id || !star || !comment) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const order = await Order.findOne({
      customer_id: req.user.id,
      _id: order_id,
    }).populate("list_cart_item_id");
    if (!order) {
      res.status(404);
      throw new Error("No order found");
    }

    const plant = await Plant.findById(plant_id);
    if (!plant) {
      res.status(404);
      throw new Error("No plant found");
    }

    const checkPlantExistInOrder = order.list_cart_item_id.find(
      (item) => item.plant_id.toString() === plant_id
    );

    if (!checkPlantExistInOrder) {
      res.status(400);
      throw new Error("No plant found in order");
    }

    if (order.status !== OrderStatusEnum.DELIVERED) {
      res.status(400);
      throw new Error("Order status is not allowed for rating");
    }

    const IsExistRatingOfPlantOfOrder = await Rating.findOne({
      order_id,
      plant_id,
      user_id: req.user.id,
    });

    if (IsExistRatingOfPlantOfOrder) {
      res.status(400);
      throw new Error("Plant in order is already rated");
    }

    const newRating = new Rating({
      order_id,
      plant_id,
      user_id: req.user.id,
      star,
      comment,
    });

    const createdRating = await newRating.save();

    // Update average rating for the plant
    await updateAverageRating(plant_id);

    res.status(201).json(createdRating);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a rating by ID
 * @route PUT /api/ratings/:id
 * @access Private
 */
const updateRatingById = asyncHandler(async (req, res) => {
  try {
    const { star, comment } = req.body;

    const rating = await Rating.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!rating) {
      res.status(404);
      throw new Error("Rating not found");
    }

    rating.star = star || rating.star;
    rating.comment = comment || rating.comment;

    const updatedRating = await rating.save();

    // Update average rating for the plant
    await updateAverageRating(rating.plant_id);

    res.status(200).json(updatedRating);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Delete a rating by ID
 * @route DELETE /api/ratings/:id
 * @access Private
 */
const deleteRatingById = asyncHandler(async (req, res) => {
  try {
    const rating = await Rating.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!rating) {
      res.status(404);
      throw new Error("Rating not found");
    }

    await rating.remove();

    // Update average rating for the plant
    await updateAverageRating(rating.plant_id);

    res.status(200).json({ message: "Rating deleted" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getAllRatingsForPlant,
  getAllRatingsOfOrder,
  createRating,
  updateRatingById,
  deleteRatingById,
};

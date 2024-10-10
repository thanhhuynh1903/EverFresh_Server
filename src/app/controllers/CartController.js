const CartItem = require("../models/CartItem");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const Plant = require("../models/Plant");
const { populate } = require("dotenv");
const Planter = require("../models/Planter");
const ProductTypeEnum = require("../../enum/ProductTypeEnum");
const Seed = require("../models/Seed");

// Create a new Cart for the logged-in customer
const createCart = asyncHandler(async (req, res) => {
  try {
    const checkExist = await Cart.findOne({ user_id: req.user.id });
    if (checkExist) {
      res.status(400);
      throw new Error("User already has a Cart");
    }

    const newCart = new Cart({
      list_cart_item_id: [],
      user_id: req.user.id,
      total_price: 0,
    });

    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get Cart for the logged-in customer
const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.find({ user_id: req.user.id }).populate(
      "list_cart_item_id"
    );

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found for the user");
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getSuggestionPlant = asyncHandler(async (req, res) => {
  try {
    const suggestionNewestPlants = await Plant.find()
      .sort({ createdAt: -1 })
      .limit(6);

    const cart = await Cart.findOne({ user_id: req.user.id }).populate(
      "list_cart_item_id"
    );

    if (!cart || cart.list_cart_item_id.length === 0) {
      return res.status(200).json(suggestionNewestPlants);
    } else {
      let suggestionPlants = [];

      for (const cart_item of cart.list_cart_item_id) {
        if (cart_item.product_type === ProductTypeEnum.PLANT) {
          const relatedPlants = await Plant.find({
            $and: [
              {
                $or: [
                  cart_item.product.genus_id
                    ? { genus_id: cart_item.product.genus_id.toString() }
                    : {},
                  cart_item.product.plant_type_id
                    ? {
                        plant_type_id:
                          cart_item.product.plant_type_id.toString(),
                      }
                    : {},
                ],
              },
              { _id: { $ne: cart_item.product._id } },
            ],
          })
            .sort({ createdAt: -1 })
            .limit(6 - suggestionPlants.length);

          relatedPlants.forEach((plant) => {
            if (!suggestionPlants.some((p) => p._id.equals(plant._id))) {
              suggestionPlants.push(plant);
            }
          });

          if (suggestionPlants.length >= 6) break;
        }
      }

      return res
        .status(200)
        .json(
          suggestionPlants.length > 0
            ? suggestionPlants
            : suggestionNewestPlants
        );
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getSuggestionPlanter = asyncHandler(async (req, res) => {
  try {
    const suggestionNewestPlanters = await Planter.find()
      .sort({ createdAt: -1 })
      .limit(6);

    const cart = await Cart.findOne({ user_id: req.user.id }).populate(
      "list_cart_item_id"
    );

    if (!cart || cart.list_cart_item_id.length === 0) {
      return res.status(200).json(suggestionNewestPlanters);
    } else {
      let suggestionPlanters = [];

      for (const cart_item of cart.list_cart_item_id) {
        if (cart_item.product_type === ProductTypeEnum.PLANTER) {
          const relatedPlanters = await Planter.find({
            category: cart_item.product.category,
            _id: { $ne: cart_item.product._id.toString() },
          })
            .sort({ createdAt: -1 })
            .limit(6 - suggestionPlanters.length);

          relatedPlanters.forEach((planter) => {
            if (!suggestionPlanters.some((p) => p._id.equals(planter._id))) {
              suggestionPlanters.push(planter);
            }
          });

          if (suggestionPlanters.length >= 6) break;
        }
      }

      return res
        .status(200)
        .json(
          suggestionPlanters.length > 0
            ? suggestionPlanters
            : suggestionNewestPlanters
        );
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getSuggestionSeed = asyncHandler(async (req, res) => {
  try {
    const suggestionNewestSeed = await Seed.find()
      .sort({ createdAt: -1 })
      .limit(6);

    const cart = await Cart.findOne({ user_id: req.user.id }).populate(
      "list_cart_item_id"
    );

    if (!cart || cart.list_cart_item_id.length === 0) {
      return res.status(200).json(suggestionNewestSeed);
    } else {
      let suggestionSeed = [];

      for (const cart_item of cart.list_cart_item_id) {
        if (cart_item.product_type === ProductTypeEnum.SEED) {
          const relatedSeeds = await Seed.find({
            $and: [
              {
                $or: [
                  cart_item.product.genus_id
                    ? { genus_id: cart_item.product.genus_id.toString() }
                    : {},
                  cart_item.product.plant_type_id
                    ? {
                        plant_type_id:
                          cart_item.product.plant_type_id.toString(),
                      }
                    : {},
                ],
              },
              { _id: { $ne: cart_item.product._id } },
            ],
          })
            .sort({ createdAt: -1 })
            .limit(6 - suggestionSeed.length);

          relatedSeeds.forEach((seed) => {
            if (!suggestionSeed.some((p) => p._id.equals(seed._id))) {
              suggestionSeed.push(seed);
            }
          });

          if (suggestionSeed.length >= 6) break;
        }
      }

      return res
        .status(200)
        .json(
          suggestionSeed.length > 0 ? suggestionSeed : suggestionNewestSeed
        );
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createCart,
  getCart,
  getSuggestionPlant,
  getSuggestionPlanter,
  getSuggestionSeed,
};

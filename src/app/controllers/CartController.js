const CartItem = require("../models/CartItem");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

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

module.exports = {
  createCart,
  getCart,
};

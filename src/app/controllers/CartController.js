const CartItem = require("../models/CartItem");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// Create a new Cart for the logged-in customer
const createCart = asyncHandler(async (req, res) => {
  const checkExist = await Cart.findOne({ user_id: req.user.id });
  if (checkExist) {
    return res.status(400).json({ message: "User has already had Cart" });
  }

  const newCart = new Cart({
    list_cart_item_id: [],
    user_id: req.user.id,
    total_price: 0,
  });

  await newCart.save();
  res.status(201).json(newCart);
});

// Get Cart for the logged-in customer
const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.find({ user_id: req.user.id }).populate(
      "list_cart_item_id"
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createCart,
  getCart,
};

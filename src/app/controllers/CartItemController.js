const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Plant = require("../models/Plant");
const asyncHandler = require("express-async-handler");

// Helper function to update total price of the cart
const updateCartTotalPrice = async (user_id) => {
  const cart = await Cart.findOne({ user_id }).populate("list_cart_item_id");

  // Recalculate total price based on CartItems
  let newTotalPrice = 0;
  cart.list_cart_item_id.forEach((cartItem) => {
    newTotalPrice += cartItem.item_total_price;
  });

  cart.total_price = newTotalPrice;
  await cart.save();
};

// Create a new CartItem (Add to Cart)
const createCartItem = asyncHandler(async (req, res) => {
  const { plant_id, quantity } = req.body;

  // Check if plant exists
  const plant = await Plant.findById(plant_id);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }

  // Calculate total price
  const item_total_price = plant.price * quantity;

  const cart = await Cart.findOne({ user_id: req.user.id }).populate(
    "list_cart_item_id"
  );
  const checkExistCartItem = cart.list_cart_item_id.find(
    (cartItem) => cartItem.plant_id.toString() == plant_id
  );
  if (!checkExistCartItem) {
    // Create new CartItem
    const newCartItem = new CartItem({
      plant_id,
      quantity,
      item_total_price,
    });
    await newCartItem.save();

    // Find the cart and add the CartItem to the cart

    cart.list_cart_item_id.push(newCartItem._id);
    await cart.save();

    // Update the total price of the cart
    await updateCartTotalPrice(req.user.id);

    res.status(201).json(newCartItem);
  } else {
    checkExistCartItem.quantity += quantity;
    checkExistCartItem.item_total_price += item_total_price;
    await checkExistCartItem.save();

    // Update the total price of the cart
    await updateCartTotalPrice(req.user.id);

    res.status(201).json(checkExistCartItem);
  }
});

// Get a single CartItem by ID
const getCartItemById = asyncHandler(async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    }).populate("plant_id");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update CartItem (Modify quantity)
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (quantity < 0 || quantity === undefined) {
    return res.status(400).json({ message: "Quantity not suitable" });
  }

  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    }).populate("plant_id");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    cartItem.item_total_price = cartItem.plant_id.price * quantity;
    await cartItem.save();

    // Update the total price of the cart
    await updateCartTotalPrice(req.user.id);

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete CartItem (Remove from Cart)
const deleteCartItem = asyncHandler(async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Remove CartItem from the cart
    const cart = await Cart.findOne({ user_id: req.user.id });
    cart.list_cart_item_id = cart.list_cart_item_id.filter(
      (item) => item.toString() !== req.params.id
    );
    await cart.save();

    await cartItem.remove();

    // Update the total price of the cart
    await updateCartTotalPrice(req.user.id);

    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createCartItem,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};

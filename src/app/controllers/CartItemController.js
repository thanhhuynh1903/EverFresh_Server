const ProductTypeEnum = require("../../enum/ProductTypeEnum");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Plant = require("../models/Plant");
const asyncHandler = require("express-async-handler");
const Planter = require("../models/Planter");
const Seed = require("../models/Seed");

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
  try {
    const { product_id, product_type, custom_color, quantity } = req.body;

    switch (product_type) {
      case ProductTypeEnum.PLANT: {
        // Check if plant exists
        const plant = await Plant.findById(product_id);
        if (!plant) {
          res.status(404);
          throw new Error("Plant not found");
        }

        // Calculate total price
        const item_total_price = plant.price * quantity;

        const cart = await Cart.findOne({ user_id: req.user.id }).populate(
          "list_cart_item_id"
        );

        const checkExistCartItem = cart.list_cart_item_id.find(
          (cartItem) => cartItem.product_id.toString() == product_id
        );

        if (!checkExistCartItem) {
          // Create new CartItem
          const newCartItem = new CartItem({
            product_id,
            product_type,
            product: plant,
            quantity,
            item_total_price,
          });
          await newCartItem.save();

          // Add the CartItem to the cart
          cart.list_cart_item_id.push(newCartItem._id);
          await cart.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(newCartItem);
        } else {
          // Update the existing CartItem
          checkExistCartItem.quantity += quantity;
          checkExistCartItem.item_total_price += item_total_price;
          await checkExistCartItem.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(checkExistCartItem);
        }
        break;
      }
      case ProductTypeEnum.PLANTER: {
        // Check if plant exists
        const planter = await Planter.findById(product_id);
        if (!planter) {
          res.status(404);
          throw new Error("Planter not found");
        }

        // Calculate total price
        const item_total_price = planter.price * quantity;

        const cart = await Cart.findOne({ user_id: req.user.id }).populate(
          "list_cart_item_id"
        );

        const checkExistCartItem = cart.list_cart_item_id.find(
          (cartItem) => cartItem.product_id.toString() == product_id
        );

        if (!checkExistCartItem) {
          // Create new CartItem
          const newCartItem = new CartItem({
            product_id,
            product_type,
            product: planter,
            custom_color: custom_color || undefined,
            quantity,
            item_total_price,
          });
          await newCartItem.save();

          // Add the CartItem to the cart
          cart.list_cart_item_id.push(newCartItem._id);
          await cart.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(newCartItem);
        } else {
          // Update the existing CartItem
          checkExistCartItem.quantity += quantity;
          checkExistCartItem.item_total_price += item_total_price;
          await checkExistCartItem.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(checkExistCartItem);
        }
        break;
      }
      case ProductTypeEnum.SEED: {
        // Check if plant exists
        const seed = await Seed.findById(product_id);
        if (!seed) {
          res.status(404);
          throw new Error("Seed not found");
        }

        // Calculate total price
        const item_total_price = seed.price * quantity;

        const cart = await Cart.findOne({ user_id: req.user.id }).populate(
          "list_cart_item_id"
        );

        const checkExistCartItem = cart.list_cart_item_id.find(
          (cartItem) => cartItem.product_id.toString() == product_id
        );

        if (!checkExistCartItem) {
          // Create new CartItem
          const newCartItem = new CartItem({
            product_id,
            product_type,
            product: seed,
            quantity,
            item_total_price,
          });
          await newCartItem.save();

          // Add the CartItem to the cart
          cart.list_cart_item_id.push(newCartItem._id);
          await cart.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(newCartItem);
        } else {
          // Update the existing CartItem
          checkExistCartItem.quantity += quantity;
          checkExistCartItem.item_total_price += item_total_price;
          await checkExistCartItem.save();

          // Update the total price of the cart
          await updateCartTotalPrice(req.user.id);

          res.status(201).json(checkExistCartItem);
        }
        break;
      }
      default: {
        res.status(400);
        throw new Error("Product type not supported");
      }
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get a single CartItem by ID
const getCartItemById = asyncHandler(async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    });

    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    res.status(200).json(cartItem);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Update CartItem (Modify quantity)
const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 0 || quantity === undefined) {
      res.status(400);
      throw new Error("Quantity not suitable");
    }

    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    });

    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    if (quantity == 0) {
      // Remove CartItem from the cart
      const cart = await Cart.findOne({ user_id: req.user.id });
      cart.list_cart_item_id = cart.list_cart_item_id.filter(
        (item) => item.toString() !== req.params.id
      );
      await cart.save();

      await cartItem.remove();

      // Update the total price of the cart
      await updateCartTotalPrice(req.user.id);

      res.status(200).json({ cartItem: "" });
    } else {
      cartItem.quantity = quantity;
      cartItem.item_total_price = cartItem.product.price * quantity;
      await cartItem.save();

      // Update the total price of the cart
      await updateCartTotalPrice(req.user.id);

      res.status(200).json(cartItem);
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete CartItem (Remove from Cart)
const deleteCartItem = asyncHandler(async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
    });

    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
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
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createCartItem,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};

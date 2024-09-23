const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const DeliveryMethod = require("../models/DeliveryMethod");
const DeliveryInformation = require("../models/DeliveryInformation");
const Voucher = require("../models/Voucher");

// Create a new Order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      payment_method,
      voucher_id,
      delivery_method_id,
      delivery_information_id,
      cart_id,
    } = req.body;
    if (
      payment_method === undefined ||
      delivery_method_id === undefined ||
      cart_id === undefined
    ) {
      res.status(404);
      throw new Error("All fields are required");
    }
    // Check if the cart exists
    const cart = await Cart.findById(cart_id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the delivery method exists
    const deliveryMethod = await DeliveryMethod.findById(delivery_method_id);
    if (!deliveryMethod) {
      return res.status(404).json({ message: "Delivery method not found" });
    }

    // Check if the delivery information exists
    let deliveryInfo = null;
    if (delivery_information_id) {
      deliveryInfo = await DeliveryInformation.findById(
        delivery_information_id
      );
      if (!deliveryInfo) {
        return res
          .status(404)
          .json({ message: "Delivery information not found" });
      }
    } else {
      deliveryInfo = await DeliveryInformation.findOne({
        user_id: req.user.id,
        is_default: true,
      });
      if (!deliveryInfo) {
        return res
          .status(404)
          .json({ message: "You must add Delivery information to order" });
      }
    }

    let voucher = null;
    // Check if the voucher exists (optional, only if voucher_id is provided)
    if (voucher_id) {
      voucher = await Voucher.findById(voucher_id);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
    }

    // Create new order
    const newOrder = new Order({
      customer_id: req.user.id,
      payment_method,
      voucher_id: voucher_id || null,
      delivery_method: {
        delivery_method_name: deliveryMethod.delivery_method_name,
        price: deliveryMethod.price,
      },
      delivery_information: {
        phone_number: deliveryInfo.phone_number,
        address: deliveryInfo.address,
        address_detail: deliveryInfo.address_detail,
      },
      total_price:
        voucher === null
          ? cart.total_price + deliveryMethod.price
          : cart.total_price -
            (cart.total_price * voucher.voucher_discount) / 100 +
            deliveryMethod.price,
      list_cart_item_id: cart.list_cart_item_id,
    });

    await newOrder.save();

    // reset cart
    cart.list_cart_item_id = [];
    cart.total_price = 0;
    await cart.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for logged-in customer
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user.id })
      .populate("voucher_id") // Populate voucher
      .populate({
        path: "list_cart_item_id", // Populate cart items
        populate: {
          path: "plant_id", // Populate plant within cart items
          model: "Plant",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for Admin
const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("voucher_id") // Populate voucher
      .populate({
        path: "list_cart_item_id", // Populate cart items
        populate: {
          path: "plant_id", // Populate plant within cart items
          model: "Plant",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("voucher_id") // Populate voucher
      .populate({
        path: "list_cart_item_id", // Populate cart items
        populate: {
          path: "plant_id", // Populate plant within cart items
          model: "Plant",
        },
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order by ID for Admins only
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createOrder,
  getAllOrders,
  getAllOrdersForAdmin,
  getOrderById,
  deleteOrder,
};

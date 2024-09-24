const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const DeliveryMethod = require("../models/DeliveryMethod");
const DeliveryInformation = require("../models/DeliveryInformation");
const Voucher = require("../models/Voucher");
const OrderStatusEnum = require("../../enum/OrderStatusEnum");

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

    if (!payment_method || !delivery_method_id || !cart_id) {
      res.status(400);
      throw new Error(
        "Payment method, delivery method, and cart ID are required"
      );
    }

    const cart = await Cart.findById(cart_id);
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const deliveryMethod = await DeliveryMethod.findById(delivery_method_id);
    if (!deliveryMethod) {
      res.status(404);
      throw new Error("Delivery method not found");
    }

    let deliveryInfo;
    if (delivery_information_id) {
      deliveryInfo = await DeliveryInformation.findById(
        delivery_information_id
      );
      if (!deliveryInfo) {
        res.status(404);
        throw new Error("Delivery information not found");
      }
    } else {
      deliveryInfo = await DeliveryInformation.findOne({
        user_id: req.user.id,
        is_default: true,
      });
      if (!deliveryInfo) {
        res.status(404);
        throw new Error("You must add Delivery information to order");
      }
    }

    let voucher = null;
    if (voucher_id) {
      voucher = await Voucher.findById(voucher_id);
      if (!voucher) {
        res.status(404);
        throw new Error("Voucher not found");
      }
    }
    const total_price = voucher
      ? cart.total_price -
        (cart.total_price * voucher.voucher_discount) / 100 +
        deliveryMethod.price
      : cart.total_price + deliveryMethod.price;

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
      total_price: total_price,
      list_cart_item_id: cart.list_cart_item_id,
      status: OrderStatusEnum.CONFIRMED,
    });

    await newOrder.save();

    cart.list_cart_item_id = [];
    cart.total_price = 0;
    await cart.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all orders for logged-in customer
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user.id })
      .populate("voucher_id")
      .populate({
        path: "list_cart_item_id",
        populate: {
          path: "plant_id",
          model: "Plant",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get all orders for Admin
const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("voucher_id")
      .populate({
        path: "list_cart_item_id",
        populate: {
          path: "plant_id",
          model: "Plant",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("voucher_id")
      .populate({
        path: "list_cart_item_id",
        populate: {
          path: "plant_id",
          model: "Plant",
        },
      });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

// Delete an order by ID for Admins only
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createOrder,
  getAllOrders,
  getAllOrdersForAdmin,
  getOrderById,
  deleteOrder,
};

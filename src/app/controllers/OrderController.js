const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const DeliveryMethod = require("../models/DeliveryMethod");
const DeliveryInformation = require("../models/DeliveryInformation");
const Voucher = require("../models/Voucher");
const OrderStatusEnum = require("../../enum/OrderStatusEnum");
const Notification = require("../models/Notification");
const NotificationTypeEnum = require("../../enum/NotificationTypeEnum");

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
    const orders = await Order.find().populate("voucher_id").populate({
      path: "list_cart_item_id",
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

// Get an order by ID
const changeStatusToFailedDelivery = asyncHandler(async (req, res) => {
  try {
    const { failed_delivery_note } = req.body;
    if (!failed_delivery_note) {
      res.status(404);
      throw new Error("Note is required");
    }
    const order = await Order.findById(req.params.id)
      .populate("voucher_id")
      .populate({
        path: "list_cart_item_id",
      });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatusEnum.OUT_OF_DELIVERY) {
      res.status(400);
      throw new Error("Order status is not suitable");
    }
    const tracking_status_dates = order.tracking_status_dates.push({
      key: "failed_delivery",
      value: new Date(),
    });
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: OrderStatusEnum.FAILED_DELIVERY,
        tracking_status_dates: tracking_status_dates,
        failed_delivery_note,
      },
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      res.status(500);
      throw new Error(
        "Something when wrong when changing order status to failed delivery"
      );
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const changeOrderStatus = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("voucher_id")
      .populate({
        path: "list_cart_item_id",
      });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    switch (order.status) {
      case OrderStatusEnum.CONFIRMED: {
        const tracking_status_dates = [
          ...order.tracking_status_dates,
          { key: "shipped_date", value: new Date() },
        ];

        const updatedOrderStatus = await Order.findByIdAndUpdate(
          order._id,
          {
            status: OrderStatusEnum.SHIPPED,
            tracking_status_dates: tracking_status_dates,
          },
          { new: true }
        );

        if (!updatedOrderStatus) {
          res.status(500);
          throw new Error(
            "Something went wrong updating order status to Shipped"
          );
        }

        setImmediate(async () => {
          try {
            const notification = new Notification({
              user_id: order.customer_id.toString(),
              description: "Your order is shipped",
              type: NotificationTypeEnum.SHIPPED,
            });

            await notification.save();

            const userNotifications = await Notification.find({
              user_id: order.customer_id.toString(),
            }).sort({ createdAt: -1 });
            _io.emit(
              `notifications-${order.customer_id.toString()}`,
              userNotifications
            );
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        res.status(200).json(updatedOrderStatus);
        break;
      }
      case OrderStatusEnum.SHIPPED: {
        const tracking_status_dates = [
          ...order.tracking_status_dates,
          { key: "out_of_delivery_date", value: new Date() },
        ];

        const updatedOrderStatus = await Order.findByIdAndUpdate(
          order._id,
          {
            status: OrderStatusEnum.OUT_OF_DELIVERY,
            tracking_status_dates: tracking_status_dates,
          },
          { new: true }
        );

        if (!updatedOrderStatus) {
          res.status(500);
          throw new Error(
            "Something went wrong updating order status to Out of Delivery"
          );
        }

        setImmediate(async () => {
          try {
            const notification = new Notification({
              user_id: order.customer_id.toString(),
              description: "Your order is out for delivery",
              type: NotificationTypeEnum.OUT_OF_DELIVERY,
            });

            await notification.save();

            const userNotifications = await Notification.find({
              user_id: order.customer_id.toString(),
            }).sort({ createdAt: -1 });
            _io.emit(
              `notifications-${order.customer_id.toString()}`,
              userNotifications
            );
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        res.status(200).json(updatedOrderStatus);
        break;
      }
      case OrderStatusEnum.OUT_OF_DELIVERY: {
        const tracking_status_dates = [
          ...order.tracking_status_dates,
          { key: "delivered_date", value: new Date() },
        ];

        const updatedOrderStatus = await Order.findByIdAndUpdate(
          order._id,
          {
            status: OrderStatusEnum.DELIVERED,
            tracking_status_dates: tracking_status_dates,
            delivered_date: new Date(),
          },
          { new: true }
        );

        if (!updatedOrderStatus) {
          res.status(500);
          throw new Error(
            "Something went wrong updating order status to Delivered"
          );
        }

        setImmediate(async () => {
          try {
            const notification = new Notification({
              user_id: order.customer_id.toString(),
              description: "Your order has been delivered",
              type: NotificationTypeEnum.DELIVERED,
            });

            await notification.save();

            const userNotifications = await Notification.find({
              user_id: order.customer_id.toString(),
            }).sort({ createdAt: -1 });
            _io.emit(
              `notifications-${order.customer_id.toString()}`,
              userNotifications
            );
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        res.status(200).json(updatedOrderStatus);
        break;
      }
      case OrderStatusEnum.DELIVERED: {
        res.status(400);
        throw new Error("Order already delivered");
      }
      default: {
        res.status(400);
        throw new Error("Order status unavailable");
      }
    }
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

const getNewestOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findOne({ customer_id: req.user.id })
      .populate("list_cart_item_id")
      .populate("voucher_id")
      .sort({ createdAt: -1 })
      .limit(1);

    if (!order) {
      res.status(404);
      throw new Error("Have no order");
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const changeIsNewToFalse = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findOne({ customer_id: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!order) {
      res.status(404);
      throw new Error("Have no order");
    }

    const updateOrder = await Order.findByIdAndUpdate(
      order._id,
      { is_new: false },
      { new: true }
    );

    if (!updateOrder) {
      res.status(500);
      throw new Error("Something went wrong when updating order to old");
    }

    res.status(200).json(updateOrder);
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
  changeOrderStatus,
  changeStatusToFailedDelivery,
  deleteOrder,
  getNewestOrder,
  changeIsNewToFalse,
};

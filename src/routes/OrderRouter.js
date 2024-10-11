const express = require("express");
const {
  createOrder,
  getAllOrders,
  getAllOrdersForAdmin,
  getOrderById,
  deleteOrder,
  changeOrderStatus,
  changeStatusToFailedDelivery,
} = require("../app/controllers/OrderController");
const {
  validateTokenCustomer,
  validateTokenAdmin,
  validateToken,
} = require("../app/middleware/validateTokenHandler");
const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer_id
 *         - order_code
 *         - payment_method
 *         - delivery_method
 *         - delivery_information
 *         - total_price
 *         - list_cart_item_id
 *         - status
 *       properties:
 *         customer_id:
 *           type: string
 *           description: "ObjectId reference to the User (customer) placing the order"
 *         order_code:
 *           type: string
 *           description: "Unique order code"
 *         payment_method:
 *           type: string
 *           description: "Payment method used for the order"
 *         voucher_id:
 *           type: string
 *           description: "ObjectId reference to the Voucher (if applicable)"
 *         delivery_method:
 *           type: object
 *           properties:
 *             delivery_method_name:
 *               type: string
 *               description: "Name of the delivery method"
 *             price:
 *               type: number
 *               description: "Price of the delivery method"
 *         delivery_information:
 *           type: object
 *           properties:
 *             phone_number:
 *               type: string
 *               description: "Phone number for delivery"
 *             address:
 *               type: string
 *               description: "Main address for delivery"
 *             address_detail:
 *               type: string
 *               description: "Detailed address for delivery"
 *         total_price:
 *           type: number
 *           description: "Total price of the order"
 *         list_cart_item_id:
 *           type: array
 *           items:
 *             type: string
 *             description: "Array of CartItem ObjectId references"
 *         delivered_date:
 *           type: string
 *           format: date-time
 *           description: "Date the order was delivered (if applicable)"
 *         failed_delivery_note:
 *           type: string
 *           description: "Note explaining why the delivery failed (if applicable)"
 *         tracking_status_dates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: "Tracking status key"
 *               value:
 *                 type: string
 *                 format: date-time
 *                 description: "Date of the status change"
 *         status:
 *           type: string
 *           description: "Current status of the order (e.g., pending, delivered, failed)"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Order creation timestamp"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Order last update timestamp"
 */

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API for managing Order
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Customer only)
 *     description: Create a new order for the logged-in customer
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method:
 *                 type: string
 *               voucher_id:
 *                 type: string
 *               delivery_method_id:
 *                 type: string
 *               delivery_information_id:
 *                 type: string
 *               cart_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
orderRouter.post("/", validateTokenCustomer, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the logged-in customer (Customer only)
 *     description: Get all orders for the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with all orders
 *       500:
 *         description: Server error
 */
orderRouter.get("/", validateTokenCustomer, getAllOrders);

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders for Admin (Admin only)
 *     description: Get all orders in the system
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with all orders
 *       500:
 *         description: Server error
 */
orderRouter.get("/admin", validateTokenAdmin, getAllOrdersForAdmin);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Get order details by ID for the logged-in customer or Admin
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Successful response with the order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.get("/:id", validateToken, getOrderById);

/**
 * @swagger
 * /api/orders/changeStatusToFailedDelivery/{id}:
 *   put:
 *     summary: Change an order status to failed delivery by ID (Admin only)
 *     description: Change an order status to failed delivery by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               failed_delivery_note:
 *                 type: string
 *                 description: The failed delivery note
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.put(
  "/changeStatusToFailedDelivery/:id",
  validateTokenAdmin,
  changeStatusToFailedDelivery
);

/**
 * @swagger
 * /api/orders/changeStatus/{id}:
 *   put:
 *     summary: Change an order status by ID (Admin only)
 *     description: Change an order status by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.put("/changeStatus/:id", validateTokenAdmin, changeOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID (Admin only)
 *     description: Delete an order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.delete("/:id", validateTokenAdmin, deleteOrder);

module.exports = orderRouter;

const express = require("express");
const {
  createOrder,
  getAllOrders,
  getAllOrdersForAdmin,
  getOrderById,
  deleteOrder,
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

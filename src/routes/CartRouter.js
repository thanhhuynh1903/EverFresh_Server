const express = require("express");
const cartRouter = express.Router();

const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");
const { createCart, getCart } = require("../app/controllers/CartController");

cartRouter.use(validateTokenCustomer); // Ensure customer-only access

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing customer cart (Customer only)
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Create a new cart for the logged-in customer
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       500:
 *         description: Internal server error
 */
cartRouter.route("/").post(createCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the cart for the logged-in customer
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Customer's cart data
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
cartRouter.route("/").get(getCart);

module.exports = cartRouter;

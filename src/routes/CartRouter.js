const express = require("express");
const cartRouter = express.Router();

const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");
const {
  createCart,
  getCart,
  getSuggestionPlant,
  getSuggestionPlanter,
  getSuggestionSeed,
} = require("../app/controllers/CartController");

cartRouter.use(validateTokenCustomer); // Ensure customer-only access

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing customer cart (Customer only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - list_cart_item_id
 *         - user_id
 *         - total_price
 *       properties:
 *         list_cart_item_id:
 *           type: array
 *           items:
 *             type: string
 *             description: "Array of CartItem ObjectId references"
 *         user_id:
 *           type: string
 *           description: "User ObjectId"
 *         total_price:
 *           type: number
 *           description: "Total price of the cart"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time"
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

/**
 * @swagger
 * /api/cart/suggestion-plant:
 *   get:
 *     summary: Get the suggestion plant
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
cartRouter.route("/suggestion-plant").get(getSuggestionPlant);

/**
 * @swagger
 * /api/cart/suggestion-planter:
 *   get:
 *     summary: Get the suggestion planter
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
cartRouter.route("/suggestion-planter").get(getSuggestionPlanter);

/**
 * @swagger
 * /api/cart/suggestion-seed:
 *   get:
 *     summary: Get the suggestion seed
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
cartRouter.route("/suggestion-seed").get(getSuggestionSeed);

module.exports = cartRouter;

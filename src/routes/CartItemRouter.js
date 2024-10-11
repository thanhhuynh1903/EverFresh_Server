const express = require("express");
const cartItemRouter = express.Router();

const {
  validateToken,
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");
const {
  createCartItem,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
} = require("../app/controllers/CartItemController");

cartItemRouter.use(validateToken);
/**
 * @swagger
 * tags:
 *   name: CartItem
 *   description: API for managing cart items
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product_id
 *         - product_type
 *         - quantity
 *         - item_total_price
 *       properties:
 *         product_id:
 *           type: string
 *           description: "ObjectId of the product"
 *         product_type:
 *           type: string
 *           description: "Type of the product (e.g., Planter, Plant)"
 *         product:
 *           type: object
 *           description: "Details of the product"
 *         custom_color:
 *           type: string
 *           description: "Custom color selected by the user"
 *         quantity:
 *           type: number
 *           description: "Quantity of the product"
 *         item_total_price:
 *           type: number
 *           description: "Total price for the quantity of the product"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time of the cart item"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time of the cart item"
 */

/**
 * @swagger
 * /api/cart-items:
 *   post:
 *     summary: Add a new cart item (Customer Only)
 *     security:
 *       - bearerAuth: []
 *     tags: [CartItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               product_type:
 *                 type: string
 *               custom_color:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Cart item added successfully
 *       500:
 *         description: Internal server error
 */
cartItemRouter.route("/").post(validateTokenCustomer, createCartItem);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   get:
 *     summary: Get a cart item by ID for the logged-in customer
 *     security:
 *       - bearerAuth: []
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item
 *     responses:
 *       200:
 *         description: Cart item data
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartItemRouter.route("/:id").get(getCartItemById);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   put:
 *     summary: Update a cart item by ID (e.g. change quantity) (Customer Only)
 *     security:
 *       - bearerAuth: []
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartItemRouter.route("/:id").put(validateTokenCustomer, updateCartItem);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   delete:
 *     summary: Remove a cart item by ID (Customer Only)
 *     security:
 *       - bearerAuth: []
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartItemRouter.route("/:id").delete(validateTokenCustomer, deleteCartItem);

module.exports = cartItemRouter;

const express = require("express");
const ratingRouter = express.Router();
const {
  getAllRatingsForProduct,
  createRating,
  updateRatingById,
  deleteRatingById,
  getAllRatingsOfOrder,
} = require("../app/controllers/RatingController");
const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rating management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - product_id
 *         - product_type
 *         - order_id
 *         - user_id
 *         - star
 *         - comment
 *       properties:
 *         product_id:
 *           type: string
 *           description: "ObjectId reference to the rated product"
 *         product_type:
 *           type: string
 *           description: "Type of the rated product (e.g., planter, seed)"
 *         product:
 *           type: object
 *           description: "Product details (optional)"
 *         order_id:
 *           type: string
 *           description: "ObjectId reference to the order containing the product"
 *         user_id:
 *           type: string
 *           description: "ObjectId reference to the user who rated"
 *         star:
 *           type: string
 *           description: "Rating star value (e.g., 1-5)"
 *         comment:
 *           type: string
 *           description: "User's comment about the product"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Rating creation timestamp"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Rating last update timestamp"
 */

/**
 * @swagger
 * /api/ratings/{product_id}:
 *   get:
 *     summary: Get all ratings for a plant
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The plant id
 *     responses:
 *       200:
 *         description: List of ratings for the plant
 *       500:
 *         description: Server error
 */
ratingRouter.get("/:product_id", getAllRatingsForProduct);

ratingRouter.use(validateTokenCustomer);

/**
 * @swagger
 * /api/ratings/order/{order_id}:
 *   get:
 *     summary: Get all ratings of order
 *     security:
 *       - bearerAuth: []
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: List of ratings of order
 *       500:
 *         description: Server error
 */
ratingRouter.get("/order/:order_id", getAllRatingsOfOrder);

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a new rating (Customer only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: The order id
 *               product_id:
 *                 type: string
 *                 description: The plant id
 *               product_type:
 *                 type: string
 *                 description: The plant id
 *               star:
 *                 type: string
 *                 description: The rating in stars
 *               comment:
 *                 type: string
 *                 description: The comment for the rating
 *     responses:
 *       201:
 *         description: The rating was created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
ratingRouter.post("/", createRating);

/**
 * @swagger
 * /api/ratings/{id}:
 *   put:
 *     summary: Update a rating by ID (Customer only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The rating id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               star:
 *                 type: string
 *                 description: The updated rating in stars
 *               comment:
 *                 type: string
 *                 description: The updated comment for the rating
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
ratingRouter.put("/:id", updateRatingById);

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating by ID (Customer only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The rating id
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
ratingRouter.delete("/:id", deleteRatingById);

module.exports = ratingRouter;

const express = require("express");
const ratingRouter = express.Router();
const {
  getAllRatingsForPlant,
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
 * /api/ratings/{plant_id}:
 *   get:
 *     summary: Get all ratings for a plant
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: plant_id
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
ratingRouter.get("/:plant_id", getAllRatingsForPlant);

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
 *               plant_id:
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

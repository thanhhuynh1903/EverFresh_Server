const express = require("express");
const {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
  searchPlantByName,
  deletePlant,
} = require("../app/controllers/PlantController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

const PlantRouter = express.Router();

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
 *   name: Plants
 *   description: Plant management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       required:
 *         - name
 *         - genus_id
 *         - img_url
 *         - plant_type_id
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the plant
 *         sub_name:
 *           type: string
 *           description: Secondary name or variety of the plant
 *         genus_id:
 *           type: string
 *           description: ID of the genus this plant belongs to
 *         img_url:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to the images of the plant
 *         video_url:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to the videos of the plant
 *         height:
 *           type: string
 *           description: Height of the plant
 *         width:
 *           type: string
 *           description: Width of the plant
 *         zones:
 *           type: string
 *           description: Climate zones where the plant can grow
 *         uses:
 *           type: string
 *           description: Uses of the plant (e.g., ornamental, medicinal)
 *         tolerance:
 *           type: string
 *           description: The plant's tolerance to conditions (e.g., drought, frost)
 *         bloom_time:
 *           type: string
 *           description: Blooming time of the plant
 *         light:
 *           type: string
 *           description: Light requirements (e.g., full sun, partial shade)
 *         moisture:
 *           type: string
 *           description: Moisture needs (e.g., well-drained soil)
 *         maintenance:
 *           type: string
 *           description: Maintenance level required (e.g., low, moderate, high)
 *         growth_rate:
 *           type: string
 *           description: Growth rate of the plant
 *         plant_type_id:
 *           type: string
 *           description: ID of the plant type (e.g., shrub, tree, etc.)
 *         plant_seasonal_interest:
 *           type: string
 *           description: Seasonal interest of the plant (e.g., fall color, spring blooms)
 *         describe:
 *           type: string
 *           description: General description of the plant
 *         noteworthy_characteristics:
 *           type: string
 *           description: Noteworthy characteristics of the plant
 *         care:
 *           type: string
 *           description: Care instructions for the plant
 *         propagation:
 *           type: string
 *           description: How to propagate the plant
 *         problems:
 *           type: string
 *           description: Common problems with the plant
 *         water:
 *           type: string
 *           description: Water requirements
 *         humidity:
 *           type: string
 *           description: Humidity preferences
 *         fertilizer:
 *           type: string
 *           description: Fertilizer needs
 *         size:
 *           type: string
 *           description: Size of the plant
 *         price:
 *           type: string
 *           description: Price of the plant
 *         average_rating:
 *           type: string
 *           description: Average rating of the plant
 *       example:
 *         name: "Rose"
 *         sub_name: "Climbing Rose"
 *         genus_id: "60d0fe4f5311236168a109ca"
 *         plant_type_id: "60d0fe4f5311236168a109cb"
 *         img_url: ["https://example.com/rose.jpg"]
 *         video_url: ["https://example.com/rose-video.mp4"]
 *         height: "2 meters"
 *         width: "1 meter"
 *         zones: "Zone 5-9"
 *         uses: "Ornamental"
 *         tolerance: "Drought-tolerant"
 *         bloom_time: "Spring"
 *         light: "Full sun"
 *         moisture: "Well-drained"
 *         maintenance: "Moderate"
 *         growth_rate: "Fast"
 *         plant_seasonal_interest: "Spring blooms"
 *         describe: "A beautiful climbing rose with pink flowers"
 *         noteworthy_characteristics: "Thorny stems"
 *         care: "Prune after blooming, water weekly."
 *         propagation: "By cutting"
 *         problems: "Aphids"
 *         water: "Water regularly"
 *         humidity: "Moderate"
 *         fertilizer: "Use balanced fertilizer monthly"
 *         size: "Medium"
 *         price: "15.99"
 *         average_rating: "4.5"
 */

/**
 * @swagger
 * /api/plants:
 *   get:
 *     summary: Get all plants
 *     tags: [Plants]
 *     responses:
 *       200:
 *         description: Returns an array of plants
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
PlantRouter.route("/").get(getPlants);

/**
 * @swagger
 * /api/plants/search:
 *   get:
 *     summary: Search plants by name
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchName
 *         schema:
 *           type: string
 *         description: The name of the plant to search
 *     responses:
 *       200:
 *         description: Returns matching plants
 *       400:
 *         description: Missing searchName parameter
 *       401:
 *         description: Unauthorized
 */
PlantRouter.route("/search").get(validateToken, searchPlantByName);

/**
 * @swagger
 * /api/plants:
 *   post:
 *     summary: Create a new plant (Admin only)
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plant'
 *     responses:
 *       201:
 *         description: Plant created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
PlantRouter.route("/").post(validateToken, createPlant);

/**
 * @swagger
 * /api/plants/{plant_id}:
 *   get:
 *     summary: Get plant by ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The plant ID
 *     responses:
 *       200:
 *         description: Returns the plant
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plant not found
 */
PlantRouter.route("/:plant_id")
  .get(validateToken, getPlantById)

  /**
   * @swagger
   * /api/plants/{plant_id}:
   *   put:
   *     summary: Update a plant by ID (Admin only)
   *     tags: [Plants]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: plant_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The plant ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Plant'
   *     responses:
   *       200:
   *         description: Plant updated successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Plant not found
   */
  .put(validateToken, updatePlant)

  /**
   * @swagger
   * /api/plants/{plant_id}:
   *   delete:
   *     summary: Delete a plant by ID (Admin only)
   *     tags: [Plants]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: plant_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The plant ID
   *     responses:
   *       200:
   *         description: Plant deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Plant not found
   */
  .delete(validateToken, deletePlant);

module.exports = PlantRouter;

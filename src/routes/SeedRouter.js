const express = require("express");
const {
  createSeed,
  getSeeds,
  getSeedById,
  updateSeed,
  searchSeedByName,
  deleteSeed,
  updateSeedStatus,
} = require("../app/controllers/SeedController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

const seedRouter = express.Router();

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
 *   name: Seeds
 *   description: Seed management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Seed:
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
 *           description: Name of the seed
 *         sub_name:
 *           type: string
 *           description: Secondary name or variety of the seed
 *         genus_id:
 *           type: string
 *           description: ID of the genus this seed belongs to
 *         img_url:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to the images of the seed
 *         video_url:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to the videos of the seed
 *         height:
 *           type: string
 *           description: Height of the seed
 *         width:
 *           type: string
 *           description: Width of the seed
 *         zones:
 *           type: string
 *           description: Climate zones where the seed can grow
 *         uses:
 *           type: string
 *           description: Uses of the seed (e.g., ornamental, medicinal)
 *         tolerance:
 *           type: string
 *           description: The seed's tolerance to conditions (e.g., drought, frost)
 *         bloom_time:
 *           type: string
 *           description: Blooming time of the seed
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
 *           description: Growth rate of the seed
 *         plant_type_id:
 *           type: string
 *           description: ID of the plant type (e.g., shrub, tree, etc.)
 *         plant_seasonal_interest:
 *           type: string
 *           description: Seasonal interest of the seed (e.g., fall color, spring blooms)
 *         describe:
 *           type: string
 *           description: General description of the seed
 *         noteworthy_characteristics:
 *           type: string
 *           description: Noteworthy characteristics of the seed
 *         care:
 *           type: string
 *           description: Care instructions for the seed
 *         propagation:
 *           type: string
 *           description: How to propagate the seed
 *         problems:
 *           type: string
 *           description: Common problems with the seed
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
 *           description: Size of the seed
 *         price:
 *           type: number
 *           description: Price of the seed
 *       example:
 *         name: "Rose"
 *         sub_name: "Climbing Rose"
 *         genus_id: "67063c20591dd97cef2023bc"
 *         plant_type_id: "67063c3b591dd97cef2023c3"
 *         img_url: ["https://cdn.mos.cms.futurecdn.net/a8JC3M6zFPkYvydLY95nXW.jpg"]
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
 *         price: 150000
 */

/**
 * @swagger
 * /api/seeds:
 *   get:
 *     summary: Get all Seeds
 *     tags: [Seeds]
 *     responses:
 *       200:
 *         description: Returns an array of Seeds
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
seedRouter.route("/").get(getSeeds);

/**
 * @swagger
 * /api/seeds/search:
 *   get:
 *     summary: Search Seeds by name
 *     tags: [Seeds]
 *     parameters:
 *       - in: query
 *         name: searchName
 *         schema:
 *           type: string
 *         description: The name of the plant to search
 *     responses:
 *       200:
 *         description: Returns matching Seeds
 *       400:
 *         description: Missing searchName parameter
 *       401:
 *         description: Unauthorized
 */
seedRouter.route("/search").get(searchSeedByName);

/**
 * @swagger
 * /api/seeds:
 *   post:
 *     summary: Create a new Seeds (Admin only)
 *     tags: [Seeds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seed'
 *     responses:
 *       201:
 *         description: Seed created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
seedRouter.route("/").post(validateToken, createSeed);

/**
 * @swagger
 * /api/seeds/{seed_id}:
 *   get:
 *     summary: Get Seed by ID
 *     tags: [Seeds]
 *     parameters:
 *       - in: path
 *         name: seed_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Seed ID
 *     responses:
 *       200:
 *         description: Returns the Seed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Seed not found
 */
seedRouter
  .route("/:seed_id")
  .get(getSeedById)

  /**
   * @swagger
   * /api/seeds/{seed_id}:
   *   put:
   *     summary: Update a Seed by ID (Admin only)
   *     tags: [Seeds]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: seed_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The Seed ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Seed'
   *     responses:
   *       200:
   *         description: Seed updated successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Seed not found
   */
  .put(validateToken, updateSeed)

  /**
   * @swagger
   * /api/seeds/{seed_id}:
   *   delete:
   *     summary: Delete a Seed by ID (Admin only)
   *     tags: [Seeds]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: seed_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The Seed ID
   *     responses:
   *       200:
   *         description: Seed deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Seed not found
   */
  .delete(validateToken, deleteSeed);

/**
 * @swagger
 * /api/seeds/status/{seed_id}:
 *   put:
 *     summary: Update a Seed status by ID (Admin only)
 *     tags: [Seeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seed_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Seed ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the Seed
 *                 example: "Out of Stock"
 *     responses:
 *       200:
 *         description: Seed updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Seed not found
 */
seedRouter.route("/status/:seed_id").put(validateToken, updateSeedStatus);

module.exports = seedRouter;

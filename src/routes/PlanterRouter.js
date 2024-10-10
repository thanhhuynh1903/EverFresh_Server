const express = require("express");
const planterRouter = express.Router();
const {
  getPlanters,
  getPlanterById,
  createPlanter,
  updatePlanter,
  deletePlanter,
  searchPlanterByName,
} = require("../app/controllers/PlanterController");
const {
  validateTokenCustomer,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Planters
 *   description: Planter management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Planter:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - img_object
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the planter
 *           example: "Elegant Ceramic Planter"
 *         category:
 *           type: string
 *           description: Category of the planter
 *           example: "Smarter Planter"
 *         img_object:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               img_url:
 *                 type: string
 *                 description: Image URL of the planter
 *                 example: "https://example.com/images/planter1.jpg"
 *               color:
 *                 type: string
 *                 description: Color of the planter in the image
 *                 example: "White"
 *         video_url:
 *           type: array
 *           items:
 *             type: string
 *           description: Video URLs for the planter
 *           example: ["https://example.com/videos/planter1.mp4"]
 *         price:
 *           type: number
 *           description: Price of the planter
 *           example: 499000
 *         size:
 *           type: string
 *           description: Size of the planter
 *           example: "Medium"
 *         introduction:
 *           type: string
 *           description: Introduction about the planter
 *           example: "An elegant ceramic planter perfect for indoor plants."
 *         material:
 *           type: string
 *           description: Material of the planter
 *           example: "Ceramic"
 *         special_feature:
 *           type: string
 *           description: Special features of the planter
 *           example: "Water-resistant"
 *         style:
 *           type: string
 *           description: Style of the planter
 *           example: "Modern"
 *         planter_form:
 *           type: string
 *           description: The form of the planter
 *           example: "Round"
 *         about:
 *           type: string
 *           description: Additional information about the planter
 *           example: "Suitable for both indoor and outdoor use."
 *         describe:
 *           type: string
 *           description: Detailed description of the planter
 *           example: "This planter is made of high-quality ceramic, designed for durability."
 *         default_color:
 *           type: string
 *           description: Default color of the planter
 *           example: "White"
 *         theme:
 *           type: string
 *           description: Theme of the planter
 *           example: "Minimalist"
 *         finish_type:
 *           type: string
 *           description: Finish type of the planter
 *           example: "Glossy"
 *         item_weight:
 *           type: string
 *           description: Weight of the planter item
 *           example: "1.5 kg"
 *         manufacturer:
 *           type: string
 *           description: Manufacturer of the planter
 *           example: "GreenThumb Industries"
 *         ASIN:
 *           type: string
 *           description: ASIN number of the planter
 *           example: "B08J5F6P1D"
 *         item_model_number:
 *           type: string
 *           description: Item model number of the planter
 *           example: "GT-12345"
 *         best_seller_rank:
 *           type: string
 *           description: Best seller rank of the planter
 *           example: "#25 in Home & Garden"
 *         date_first_available:
 *           type: string
 *           format: date
 *           description: Date when the planter was first available
 *           example: "2023-01-15"
 */

/**
 * @swagger
 * /api/planters:
 *   get:
 *     summary: Get all planters
 *     tags: [Planters]
 *     responses:
 *       200:
 *         description: A list of planters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Planter'
 */
planterRouter.get("/", getPlanters);

/**
 * @swagger
 * /api/planters/{id}:
 *   get:
 *     summary: Get a planter by ID
 *     tags: [Planters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A planter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Planter'
 */
planterRouter.get("/:id", getPlanterById);

/**
 * @swagger
 * /api/planters/search:
 *   get:
 *     summary: Search planters by name
 *     tags: [Planters]
 *     parameters:
 *       - in: query
 *         name: searchName
 *         schema:
 *           type: string
 *         description: The name of the plant to search
 *     responses:
 *       200:
 *         description: Returns matching planters
 *       400:
 *         description: Missing searchName parameter
 *       401:
 *         description: Unauthorized
 */
planterRouter.route("/search").get(searchPlanterByName);

/**
 * @swagger
 * /api/planters:
 *   post:
 *     summary: Create a new planter (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Planters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Planter'
 *     responses:
 *       201:
 *         description: Planter created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Planter'
 */
planterRouter.post("/", validateTokenAdmin, createPlanter);

/**
 * @swagger
 * /api/planters/{id}:
 *   put:
 *     summary: Update a planter (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Planters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Planter'
 *     responses:
 *       200:
 *         description: Planter updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Planter'
 */
planterRouter.put("/:id", validateTokenAdmin, updatePlanter);

/**
 * @swagger
 * /api/planters/{id}:
 *   delete:
 *     summary: Delete a planter (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Planters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Planter removed
 */
planterRouter.delete("/:id", validateTokenAdmin, deletePlanter);

module.exports = planterRouter;

const express = require("express");
const plantTypeRouter = express.Router();

const {
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");
const {
  createPlantType,
  getAllPlantTypes,
  getPlantTypeById,
  updatePlantType,
  deletePlantType,
} = require("../app/controllers/PlantTypeController");

plantTypeRouter.use(validateTokenAdmin); // All routes require admin access

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
 *     PlantType:
 *       type: object
 *       required:
 *         - plant_type_name
 *       properties:
 *         plant_type_name:
 *           type: string
 *           description: "Name of plant type"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time of plant type"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time of plant type"
 */

/**
 * @swagger
 * tags:
 *   name: PlantType
 *   description: API for managing plant types (Admin only)
 */

/**
 * @swagger
 * /api/plant-types:
 *   get:
 *     summary: Get all plant types
 *     security:
 *       - bearerAuth: []
 *     tags: [PlantType]
 *     responses:
 *       200:
 *         description: List of all plant types
 *       500:
 *         description: Internal server error
 */
plantTypeRouter.route("/").get(getAllPlantTypes);

/**
 * @swagger
 * /api/plant-types:
 *   post:
 *     summary: Create a new plant type
 *     security:
 *       - bearerAuth: []
 *     tags: [PlantType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant_type_name:
 *                 type: string
 *                 description: Name of the plant type
 *     responses:
 *       201:
 *         description: Plant type created successfully
 *       400:
 *         description: Plant type already exists
 *       500:
 *         description: Internal server error
 */
plantTypeRouter.route("/").post(createPlantType);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   get:
 *     summary: Get a plant type by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [PlantType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant type
 *     responses:
 *       200:
 *         description: Plant type data
 *       404:
 *         description: Plant type not found
 *       500:
 *         description: Internal server error
 */
plantTypeRouter.route("/:id").get(getPlantTypeById);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   put:
 *     summary: Update a plant type by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [PlantType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant_type_name:
 *                 type: string
 *                 description: Updated name of the plant type
 *     responses:
 *       200:
 *         description: Plant type updated successfully
 *       404:
 *         description: Plant type not found
 *       500:
 *         description: Internal server error
 */
plantTypeRouter.route("/:id").put(updatePlantType);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   delete:
 *     summary: Delete a plant type by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [PlantType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant type
 *     responses:
 *       200:
 *         description: Plant type deleted successfully
 *       404:
 *         description: Plant type not found
 *       500:
 *         description: Internal server error
 */
plantTypeRouter.route("/:id").delete(deletePlantType);

module.exports = plantTypeRouter;

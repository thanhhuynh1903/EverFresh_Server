const express = require("express");
const genusRouter = express.Router();

const {
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");
const {
  createGenus,
  getAllGenus,
  getGenusById,
  updateGenus,
  deleteGenus,
} = require("../app/controllers/GenusController");

genusRouter.use(validateTokenAdmin);

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
 *   name: Genus
 *   description: API for managing genus (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genus:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Genus's name
 *       example:
 *         name: ABC
 */

/**
 * @swagger
 * /api/genus:
 *   get:
 *     summary: Get all genus
 *     security:
 *       - bearerAuth: []
 *     tags: [Genus]
 *     responses:
 *       200:
 *         description: List of all genus
 *       500:
 *         description: Internal server error
 */
genusRouter.route("/").get(getAllGenus);

/**
 * @swagger
 * /api/genus:
 *   post:
 *     summary: Create a new genus
 *     security:
 *       - bearerAuth: []
 *     tags: [Genus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the genus
 *     responses:
 *       201:
 *         description: Genus created successfully
 *       400:
 *         description: Genus already exists
 *       500:
 *         description: Internal server error
 */
genusRouter.route("/").post(createGenus);

/**
 * @swagger
 * /api/genus/{id}:
 *   get:
 *     summary: Get a genus by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Genus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genus
 *     responses:
 *       200:
 *         description: Genus data
 *       404:
 *         description: Genus not found
 *       500:
 *         description: Internal server error
 */
genusRouter.route("/:id").get(getGenusById);

/**
 * @swagger
 * /api/genus/{id}:
 *   put:
 *     summary: Update a genus by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Genus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genus
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the genus
 *     responses:
 *       200:
 *         description: Genus updated successfully
 *       404:
 *         description: Genus not found
 *       500:
 *         description: Internal server error
 */
genusRouter.route("/:id").put(updateGenus);

/**
 * @swagger
 * /api/genus/{id}:
 *   delete:
 *     summary: Delete a genus by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Genus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genus
 *     responses:
 *       200:
 *         description: Genus deleted successfully
 *       404:
 *         description: Genus not found
 *       500:
 *         description: Internal server error
 */
genusRouter.route("/:id").delete(deleteGenus);

module.exports = genusRouter;

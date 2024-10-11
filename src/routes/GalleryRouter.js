const express = require("express");
const galleryRouter = express.Router();
const { getGalleryOfUser } = require("../app/controllers/GalleryController");
const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Galleries
 *   description: Gallery management (Customer only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gallery:
 *       type: object
 *       required:
 *         - list_collection_id
 *         - user_id
 *       properties:
 *         list_collection_id:
 *           type: array
 *           items:
 *             type: string
 *             description: "Array of Collection ObjectId references"
 *         user_id:
 *           type: string
 *           description: "User ObjectId who owns the gallery"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time of the gallery"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time of the gallery"
 */

/**
 * @swagger
 * /api/galleries:
 *   get:
 *     summary: Get all galleries
 *     security:
 *       - bearerAuth: []
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: A list of galleries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gallery'
 */
galleryRouter.get("/", validateTokenCustomer, getGalleryOfUser);

module.exports = galleryRouter;

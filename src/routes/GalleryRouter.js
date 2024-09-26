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

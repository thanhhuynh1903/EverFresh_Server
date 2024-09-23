const express = require("express");
const deliveryMethodRouter = express.Router();

const {
  validateTokenAdmin,
  validateToken,
} = require("../app/middleware/validateTokenHandler");
const {
  createDeliveryMethod,
  getAllDeliveryMethods,
  getDeliveryMethodById,
  updateDeliveryMethod,
  deleteDeliveryMethod,
} = require("../app/controllers/DeliveryMethodController");

/**
 * @swagger
 * tags:
 *   name: DeliveryMethod
 *   description: API for managing delivery methods
 */

/**
 * @swagger
 * /api/delivery-methods:
 *   get:
 *     summary: Get all delivery methods
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryMethod]
 *     responses:
 *       200:
 *         description: List of all delivery methods
 *       500:
 *         description: Internal server error
 */
deliveryMethodRouter.route("/").get(validateToken, getAllDeliveryMethods);

/**
 * @swagger
 * /api/delivery-methods:
 *   post:
 *     summary: Create a new delivery method (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryMethod]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_method_name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Delivery method created successfully
 *       400:
 *         description: Delivery method already exists
 *       500:
 *         description: Internal server error
 */
deliveryMethodRouter.route("/").post(validateTokenAdmin, createDeliveryMethod);

/**
 * @swagger
 * /api/delivery-methods/{id}:
 *   get:
 *     summary: Get a delivery method by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery method
 *     responses:
 *       200:
 *         description: Delivery method data
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Internal server error
 */
deliveryMethodRouter.route("/:id").get(validateToken, getDeliveryMethodById);

/**
 * @swagger
 * /api/delivery-methods/{id}:
 *   put:
 *     summary: Update a delivery method by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery method
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_method_name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Delivery method updated successfully
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Internal server error
 */
deliveryMethodRouter
  .route("/:id")
  .put(validateTokenAdmin, updateDeliveryMethod);

/**
 * @swagger
 * /api/delivery-methods/{id}:
 *   delete:
 *     summary: Delete a delivery method by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery method
 *     responses:
 *       200:
 *         description: Delivery method deleted successfully
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Internal server error
 */
deliveryMethodRouter
  .route("/:id")
  .delete(validateTokenAdmin, deleteDeliveryMethod);

module.exports = deliveryMethodRouter;

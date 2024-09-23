const express = require("express");
const deliveryInformationRouter = express.Router();

const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");
const {
  createDeliveryInformation,
  getAllDeliveryInformation,
  getDeliveryInformationById,
  updateDeliveryInformation,
  deleteDeliveryInformation,
  updateDeliveryInformationDefault,
} = require("../app/controllers/DeliveryInformationController");

deliveryInformationRouter.use(validateTokenCustomer);

/**
 * @swagger
 * tags:
 *   name: DeliveryInformation
 *   description: API for managing delivery information (Customer only)
 */

/**
 * @swagger
 * /api/delivery-information:
 *   get:
 *     summary: Get all delivery information for the logged-in customer
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     responses:
 *       200:
 *         description: List of all delivery information
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter.route("/").get(getAllDeliveryInformation);

/**
 * @swagger
 * /api/delivery-information:
 *   post:
 *     summary: Create a new delivery information
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               address_detail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Delivery information created successfully
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter.route("/").post(createDeliveryInformation);

/**
 * @swagger
 * /api/delivery-information/{id}:
 *   get:
 *     summary: Get a delivery information by ID for the logged-in customer
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery information
 *     responses:
 *       200:
 *         description: Delivery information data
 *       404:
 *         description: Delivery information not found
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter.route("/:id").get(getDeliveryInformationById);

/**
 * @swagger
 * /api/delivery-information/{id}:
 *   put:
 *     summary: Update a delivery information by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               address_detail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery information updated successfully
 *       404:
 *         description: Delivery information not found
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter.route("/:id").put(updateDeliveryInformation);

/**
 * @swagger
 * /api/delivery-information/default/{id}:
 *   put:
 *     summary: Update a delivery information default by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery information
 *     responses:
 *       200:
 *         description: Delivery information updated successfully
 *       404:
 *         description: Delivery information not found
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter
  .route("/default/:id")
  .put(updateDeliveryInformationDefault);

/**
 * @swagger
 * /api/delivery-information/{id}:
 *   delete:
 *     summary: Delete a delivery information by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [DeliveryInformation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery information
 *     responses:
 *       200:
 *         description: Delivery information deleted successfully
 *       404:
 *         description: Delivery information not found
 *       500:
 *         description: Internal server error
 */
deliveryInformationRouter.route("/:id").delete(deleteDeliveryInformation);

module.exports = deliveryInformationRouter;

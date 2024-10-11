const express = require("express");
const linkedInformationRouter = express.Router();
const {
  getAllLinkedInfoOfUser,
  getLinkedInfoById,
  createLinkedInfo,
  updateLinkedInfo,
  deleteLinkedInfo,
} = require("../app/controllers/LinkedInformationController");
const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Linked Information
 *   description: Linked Information management (Customer only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LinkedInformation:
 *       type: object
 *       required:
 *         - user_id
 *         - author
 *         - card_number
 *         - expiration_date
 *         - cvv
 *       properties:
 *         user_id:
 *           type: string
 *           description: "User ObjectId associated with this linked information"
 *         author:
 *           type: string
 *           description: "Cardholder's name"
 *         card_number:
 *           type: string
 *           description: "Unique card number"
 *         expiration_date:
 *           type: string
 *           description: "Expiration date of the card"
 *         cvv:
 *           type: string
 *           description: "CVV security code of the card"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Creation time of the linked information"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Last update time of the linked information"
 */

/**
 * @swagger
 * /api/linked-information:
 *   get:
 *     summary: Get all linked information for a customer
 *     tags: [Linked Information]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Linked information list
 */
linkedInformationRouter.get("/", validateTokenCustomer, getAllLinkedInfoOfUser);

/**
 * @swagger
 * /api/linked-information/{id}:
 *   get:
 *     summary: Get linked information by ID
 *     tags: [Linked Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Linked information ID
 *     responses:
 *       200:
 *         description: Linked information details
 */
linkedInformationRouter.get("/:id", validateTokenCustomer, getLinkedInfoById);

/**
 * @swagger
 * /api/linked-information:
 *   post:
 *     summary: Create new linked information
 *     tags: [Linked Information]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: Author of the card
 *               card_number:
 *                 type: string
 *                 description: Card number
 *               expiration_date:
 *                 type: string
 *                 description: Expiration date
 *               cvv:
 *                 type: string
 *                 description: CVV code
 *     responses:
 *       201:
 *         description: Linked information created
 */
linkedInformationRouter.post("/", validateTokenCustomer, createLinkedInfo);

/**
 * @swagger
 * /api/linked-information/{id}:
 *   put:
 *     summary: Update linked information by ID
 *     tags: [Linked Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Linked information ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: Author of the card
 *               card_number:
 *                 type: string
 *                 description: Card number
 *               expiration_date:
 *                 type: string
 *                 description: Expiration date
 *               cvv:
 *                 type: string
 *                 description: CVV code
 *     responses:
 *       200:
 *         description: Linked information updated
 */
linkedInformationRouter.put("/:id", validateTokenCustomer, updateLinkedInfo);

/**
 * @swagger
 * /api/linked-information/{id}:
 *   delete:
 *     summary: Delete linked information by ID
 *     tags: [Linked Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Linked information ID
 *     responses:
 *       200:
 *         description: Linked information deleted
 */
linkedInformationRouter.delete("/:id", validateTokenCustomer, deleteLinkedInfo);

module.exports = linkedInformationRouter;

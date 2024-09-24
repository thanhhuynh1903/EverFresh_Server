const express = require("express");
const {
  createMoMoPaymentUrl,
  paymentMoMoCallback,
} = require("../app/controllers/PaymentController");
const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");
const router = express.Router();

/**
 * @swagger
 * /api/payment/momo:
 *   post:
 *     summary: Create a MoMo payment URL
 *     description: Create a payment request to MoMo for the logged-in customer
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucher_id:
 *                 type: string
 *                 description: Optional voucher ID
 *               delivery_method_id:
 *                 type: string
 *                 description: Required delivery method ID
 *               delivery_information_id:
 *                 type: string
 *                 description: Optional delivery information ID (defaults to user's default)
 *               cart_id:
 *                 type: string
 *                 description: Required cart ID
 *     responses:
 *       200:
 *         description: Payment URL created successfully
 *       400:
 *         description: Bad request, missing fields
 *       404:
 *         description: Resource not found (Cart, Delivery Method, etc.)
 *       500:
 *         description: Internal server error
 */
router.post("/momo", validateTokenCustomer, createMoMoPaymentUrl);

/**
 * @swagger
 * /api/payment/momo/callback:
 *   get:
 *     summary: Handle MoMo payment callback
 *     description: Receive and process the MoMo payment result
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID from MoMo response
 *     responses:
 *       201:
 *         description: Order created successfully after payment confirmation
 *       400:
 *         description: Invalid order ID or missing fields
 *       500:
 *         description: Internal server error
 */
router.get("/momo/paymentCallBack", paymentMoMoCallback);

module.exports = router;

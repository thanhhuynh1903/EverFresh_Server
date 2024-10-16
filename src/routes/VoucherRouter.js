const express = require("express");
const voucherRouter = express.Router();

const {
  validateTokenAdmin,
  validateToken,
} = require("../app/middleware/validateTokenHandler");
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  getAllVouchersForAdmin,
  updateVoucherStatus,
} = require("../app/controllers/VoucherController");

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: API for managing vouchers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       required:
 *         - voucher_code
 *         - voucher_name
 *         - description
 *         - start_day
 *         - end_day
 *         - is_percent
 *         - voucher_discount
 *         - quantity
 *         - status
 *       properties:
 *         voucher_code:
 *           type: string
 *           description: "Unique code for the voucher"
 *         voucher_name:
 *           type: string
 *           description: "Name of the voucher"
 *         description:
 *           type: string
 *           description: "Description of the voucher"
 *         start_day:
 *           type: string
 *           format: date
 *           description: "Start date for the voucher's validity"
 *         end_day:
 *           type: string
 *           format: date
 *           description: "End date for the voucher's validity"
 *         is_percent:
 *           type: boolean
 *           description: "Indicates if the discount is a percentage"
 *         voucher_discount:
 *           type: number
 *           description: "Discount amount or percentage value"
 *         quantity:
 *           type: number
 *           description: "Total quantity of vouchers available"
 *         status:
 *           type: string
 *           description: "Current status of the voucher (e.g., active, expired)"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Voucher creation timestamp"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Voucher last update timestamp"
 */

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Get all vouchers
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: List of all vouchers
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/").get(validateToken, getAllVouchers);

/**
 * @swagger
 * /api/vouchers/admin:
 *   get:
 *     summary: Get all vouchers
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: List of all vouchers
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/admin").get(validateTokenAdmin, getAllVouchersForAdmin);

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new voucher (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucher_code:
 *                 type: string
 *               voucher_name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_day:
 *                 type: string
 *                 format: date
 *               end_day:
 *                 type: string
 *                 format: date
 *               is_percent:
 *                 type: boolean
 *               voucher_discount:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *       400:
 *         description: Voucher already exists
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/").post(validateTokenAdmin, createVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Get a voucher by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     responses:
 *       200:
 *         description: Voucher data
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/:id").get(validateToken, getVoucherById);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Update a voucher by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucher_code:
 *                 type: string
 *               voucher_name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_day:
 *                 type: string
 *                 format: date
 *               end_day:
 *                 type: string
 *                 format: date
 *               is_percent:
 *                 type: boolean
 *               voucher_discount:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/:id").put(validateTokenAdmin, updateVoucher);

/**
 * @swagger
 * /api/vouchers/status/{id}:
 *   put:
 *     summary: Update a voucher status by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/status/:id").put(validateTokenAdmin, updateVoucherStatus);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Delete a voucher by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the voucher
 *     responses:
 *       200:
 *         description: Voucher deleted successfully
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Internal server error
 */
voucherRouter.route("/:id").delete(validateTokenAdmin, deleteVoucher);

module.exports = voucherRouter;

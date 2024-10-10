const express = require("express");
const bodyParser = require("body-parser");
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const {
  getUsers,
  getUserById,
  updateUsers,
  deleteUsers,
  currentUser,
  changePassword,
  checkOldPassword,
  statisticsAccountByStatus,
  searchAccountByEmail,
  banAccountByAdmin,
} = require("../app/controllers/UserController");
const {
  validateToken,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         dob:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         email:
 *           type: string
 *           description: User's email address
 *         phone_number:
 *           type: string
 *           description: User's phone number
 *         gender:
 *           type: string
 *           description: User's gender
 *         country:
 *           type: string
 *           description: User's country
 *         password:
 *           type: string
 *           description: User's password
 *         avatar_url:
 *           type: string
 *           description: URL to user's avatar
 *         role:
 *           type: string
 *           description: User's role
 *         status:
 *           type: boolean
 *           description: User's account status
 *       example:
 *         name: John Doe
 *         avatar_url: "avatar_url"
 *         dob: "2024-10-10"
 *         country: "Viet Nam"
 *         gender: Male
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

userRouter.use(validateToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
userRouter.route("/").get(getUsers).put(updateUsers);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's information
 *       404:
 *         description: User not found
 */
userRouter.get("/current", currentUser);

/**
 * @swagger
 * /api/users/statisticsAccount:
 *   get:
 *     summary: Get account statistics (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account statistics
 *       403:
 *         description: Forbidden
 */
userRouter
  .route("/statisticsAccount")
  .get(validateTokenAdmin, statisticsAccountByStatus);

/**
 * @swagger
 * /api/users/searchAccountByEmail:
 *   get:
 *     summary: Search accounts by email (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to search for
 *     responses:
 *       200:
 *         description: List of matching accounts
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 */
userRouter
  .route("/searchAccountByEmail")
  .get(validateTokenAdmin, searchAccountByEmail);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
userRouter.route("/:id").get(getUserById).delete(deleteUsers);

/**
 * @swagger
 * /api/users/checkOldPassword/{id}:
 *   post:
 *     summary: Check old password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Old password is correct
 *       401:
 *         description: Old password is incorrect
 *       404:
 *         description: User not found
 */
userRouter.route("/checkOldPassword/:id").post(checkOldPassword);

/**
 * @swagger
 * /api/users/changePassword/{id}:
 *   put:
 *     summary: Change user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
userRouter.route("/changePassword/:id").put(changePassword);

/**
 * @swagger
 * /api/users/banAccountByAdmin/{account_id}:
 *   patch:
 *     summary: Ban a user account (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: account_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Account ID to ban
 *     responses:
 *       200:
 *         description: Account banned successfully
 *       400:
 *         description: Cannot ban admin account
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Account not found
 */
userRouter
  .route("/banAccountByAdmin/:account_id")
  .patch(validateTokenAdmin, banAccountByAdmin);

module.exports = userRouter;

const express = require("express");
const collectionRouter = express.Router();
const {
  getCollectionById,
  addPlantToNewCollection,
  removePlantFromCollection,
  deleteCollectionById,
} = require("../app/controllers/CollectionController");
const {
  validateTokenCustomer,
} = require("../app/middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Collection management (Customer only)
 */

collectionRouter.use(validateTokenCustomer);

/**
 * @swagger
 * /api/collections/{id}:
 *   get:
 *     summary: Get collection by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection ID
 *     responses:
 *       200:
 *         description: Collection data by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         description: Collection not found
 */
collectionRouter.get("/:id", getCollectionById);

/**
 * @swagger
 * /api/collections:
 *   post:
 *     summary: Create a new collection or add a plant to an existing collection
 *     security:
 *       - bearerAuth: []
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant_id:
 *                 type: string
 *                 description: ID of the plant to add
 *               collection_name:
 *                 type: string
 *                 description: Name of the collection
 *             required:
 *               - plant_id
 *               - collection_name
 *     responses:
 *       201:
 *         description: Collection created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       400:
 *         description: All fields are required
 *       404:
 *         description: Plant not found
 */
collectionRouter.post("/", addPlantToNewCollection);

/**
 * @swagger
 * /api/collections/remove:
 *   put:
 *     summary: Remove a plant from a collection
 *     security:
 *       - bearerAuth: []
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant_id:
 *                 type: string
 *                 description: ID of the plant to remove
 *               collection_id:
 *                 type: string
 *                 description: ID of the collection
 *             required:
 *               - plant_id
 *               - collection_id
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *       404:
 *         description: Collection or plant not found
 */
collectionRouter.put("/remove", removePlantFromCollection);

/**
 * @swagger
 * /api/collections/{id}:
 *   delete:
 *     summary: Delete collection by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection ID
 *     responses:
 *       200:
 *         description: Collection deleted
 *       404:
 *         description: Collection not found
 */
collectionRouter.delete("/:id", deleteCollectionById);

module.exports = collectionRouter;

const Collection = require("../models/Collection");
const asyncHandler = require("express-async-handler");
const Plant = require("../models/Plant");
const Gallery = require("../models/Gallery");

/**
 * @desc Get a collection by ID
 * @route GET /api/collections/:id
 * @access Private
 */
const getCollectionById = asyncHandler(async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate(
      "list_plant_id"
    );
    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }
    res.status(200).json(collection);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create a new collection
 * @route POST /api/collections
 * @access Private
 */
const addPlantToFavorite = asyncHandler(async (req, res) => {
  try {
    const { plant_id } = req.body;

    if (!plant_id) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const plant = await Plant.findById(plant_id);
    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    const checkExistCollection = await Collection.findOne({
      collection_name: "Favorite",
    });

    if (!checkExistCollection) {
      const newCollection = new Collection({
        list_plant_id: [plant.id],
        collection_name: "Favorite",
        collection_img: plant.img_url[0],
      });

      const createdCollection = await newCollection.save();

      // Add new collection to gallery
      const gallery = await Gallery.findOne({ user_id: req.user.id });
      gallery.list_collection_id.push(createdCollection);
      await gallery.save();

      res.status(201).json(createdCollection);
    } else {
      if (checkExistCollection.list_plant_id.includes(plant.id)) {
        res.status(400);
        throw new Error("Plant already exists in collection");
      }

      checkExistCollection.list_plant_id.push(plant.id);
      await checkExistCollection.save();

      res.status(201).json(checkExistCollection);
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create a new collection
 * @route POST /api/collections
 * @access Private
 */
const changeCollection = asyncHandler(async (req, res) => {
  try {
    const { plant_id, collection_name } = req.body;

    if (!plant_id || !collection_name) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const plant = await Plant.findById(plant_id);
    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    const checkExistCollection = await Collection.findOne({ collection_name });

    if (!checkExistCollection) {
      const newCollection = new Collection({
        list_plant_id: [plant.id],
        collection_name,
        collection_img: plant.img_url[0],
      });

      const createdCollection = await newCollection.save();

      // Remove Plant from Favorite Collection
      const favoriteCollection = await Collection.findOne({
        collection_name: "Favorite",
      });
      favoriteCollection.list_plant_id =
        favoriteCollection.list_plant_id.filter(
          (item) => item.toString() !== plant_id
        );
      await favoriteCollection.save();

      // Add new collection to gallery
      const gallery = await Gallery.findOne({ user_id: req.user.id });
      gallery.list_collection_id.push(createdCollection);
      await gallery.save();

      res.status(201).json(createdCollection);
    } else {
      if (checkExistCollection.list_plant_id.includes(plant.id)) {
        res.status(400);
        throw new Error("Plant already exists in collection");
      }

      checkExistCollection.list_plant_id.push(plant.id);
      await checkExistCollection.save();

      // Remove Plant from Favorite Collection
      const favoriteCollection = await Collection.findOne({
        collection_name: "Favorite",
      });
      favoriteCollection.list_plant_id =
        favoriteCollection.list_plant_id.filter(
          (item) => item.toString() !== plant_id
        );
      await favoriteCollection.save();

      res.status(201).json(checkExistCollection);
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update a collection by ID
 * @route PUT /api/collections/:id
 * @access Private
 */
const removePlantFromCollection = asyncHandler(async (req, res) => {
  try {
    const { plant_id, collection_id } = req.body;
    if (!plant_id) {
      res.status(404);
      throw new Error("Plant ID is required");
    }

    if (collection_id) {
      // Case when collection_id is provided
      const collection = await Collection.findById(collection_id).populate(
        "list_plant_id"
      );

      if (!collection) {
        res.status(404);
        throw new Error("Collection not found");
      }

      const plant = await Plant.findById(plant_id);
      if (!plant) {
        res.status(404);
        throw new Error("Plant not found");
      }

      collection.list_plant_id = collection.list_plant_id.filter(
        (item) => item._id.toString() !== plant_id
      );

      const updatedCollection = await collection.save();
      res.status(200).json(updatedCollection);
    } else {
      const gallery = await Gallery.findOne({ user_id: req.user.id }).populate({
        path: "list_collection_id",
        populate: { path: "list_plant_id" },
      });

      if (!gallery) {
        res.status(404);
        throw new Error("Gallery not found");
      }

      let plantRemoved = false;

      for (const collection of gallery.list_collection_id) {
        const plantIndex = collection.list_plant_id.findIndex(
          (item) => item._id.toString() === plant_id
        );

        if (plantIndex > -1) {
          collection.list_plant_id.splice(plantIndex, 1);
          await collection.save();
          plantRemoved = true;
          break;
        }
      }

      if (plantRemoved) {
        res.status(200).json({ message: "Plant removed from collection" });
      } else {
        res.status(404);
        throw new Error("Plant not found in any collection");
      }
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Delete a collection by ID
 * @route DELETE /api/collections/:id
 * @access Private
 */
const deleteCollectionById = asyncHandler(async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }

    await collection.remove();
    res.status(200).json({ message: "Collection removed" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  addPlantToFavorite,
  getCollectionById,
  changeCollection,
  removePlantFromCollection,
  deleteCollectionById,
};

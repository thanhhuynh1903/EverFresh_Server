const Gallery = require("../models/Gallery");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get a gallery by ID
 * @route GET /api/galleries
 * @access Private
 */
const getGalleryOfUser = asyncHandler(async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ user_id: req.user.id }).populate(
      "list_collection_id"
    );
    if (!gallery) {
      res.status(404);
      throw new Error("Gallery not found");
    }
    res.status(200).json(gallery);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getGalleryOfUser,
};

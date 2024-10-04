const LinkedInformation = require("../models/LinkedInformation");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get all linked information for a user
 * @route GET /api/linked-info
 * @access Private (Customer only)
 */
const getAllLinkedInfoOfUser = asyncHandler(async (req, res) => {
  try {
    const linkedInfo = await LinkedInformation.find({ user_id: req.user.id });

    if (!linkedInfo) {
      res.status(500);
      throw new Error(
        "Something went wrong when retrieving all linked information"
      );
    }

    res.status(200).json(linkedInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Get linked information by ID
 * @route GET /api/linked-info/:id
 * @access Private (Customer only)
 */
const getLinkedInfoById = asyncHandler(async (req, res) => {
  try {
    const linkedInfo = await LinkedInformation.findOne({
      user_id: req.user.id,
      _id: req.params.id,
    });

    if (!linkedInfo) {
      res.status(404);
      throw new Error("Linked information not found");
    }

    res.status(200).json(linkedInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Create linked information
 * @route POST /api/linked-info
 * @access Private (Customer only)
 */
const createLinkedInfo = asyncHandler(async (req, res) => {
  try {
    const { author, card_number, expiration_date, cvv } = req.body;

    if (!author || !card_number || !expiration_date || !cvv) {
      res.status(400);
      throw new Error("All fields are required.");
    }

    const checkExistCart = await LinkedInformation.findOne({ card_number });
    if (checkExistCart) {
      res.status(400);
      throw new Error("Cart number is already exist");
    }

    const newLinkedInfo = new LinkedInformation({
      user_id: req.user.id,
      author,
      card_number,
      expiration_date,
      cvv,
    });

    const createdLinkedInfo = await newLinkedInfo.save();
    res.status(201).json(createdLinkedInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Update linked information by ID
 * @route PUT /api/linked-info/:id
 * @access Private (Customer only)
 */
const updateLinkedInfo = asyncHandler(async (req, res) => {
  try {
    const linkedInfo = await LinkedInformation.findOne({
      user_id: req.user.id,
      _id: req.params.id,
    });

    if (!linkedInfo) {
      res.status(404);
      throw new Error("Linked information not found");
    }

    const { author, card_number, expiration_date, cvv } = req.body;

    if (author) linkedInfo.author = author;
    if (card_number) linkedInfo.card_number = card_number;
    if (expiration_date) linkedInfo.expiration_date = expiration_date;
    if (cvv) linkedInfo.cvv = cvv;

    const updatedLinkedInfo = await linkedInfo.save();
    res.status(200).json(updatedLinkedInfo);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

/**
 * @desc Delete linked information by ID
 * @route DELETE /api/linked-info/:id
 * @access Private (Customer only)
 */
const deleteLinkedInfo = asyncHandler(async (req, res) => {
  try {
    const linkedInfo = await LinkedInformation.findOne({
      user_id: req.user.id,
      _id: req.params.id,
    });

    if (!linkedInfo) {
      res.status(404);
      throw new Error("Linked information not found");
    }

    await linkedInfo.remove();
    res.status(200).json({ message: "Linked information deleted" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getAllLinkedInfoOfUser,
  getLinkedInfoById,
  createLinkedInfo,
  updateLinkedInfo,
  deleteLinkedInfo,
};

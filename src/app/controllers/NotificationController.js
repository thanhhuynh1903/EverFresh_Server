const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get all notifications
 * @route GET /api/notifications
 * @access Private
 */
const getAllNotificationsOfUser = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Get a single notification by ID
 * @route GET /api/notifications/:id
 * @access Private
 */
const getNotificationById = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Create a new notification
 * @route POST /api/notifications
 * @access Private
 */
const createNotification = asyncHandler(async (req, res) => {
  const { description, user_id } = req.body;

  if (!description) {
    res.status(400);
    throw new Error("Description is required");
  }

  const newNotification = new Notification({
    user_id,
    description,
  });

  try {
    const createdNotification = await newNotification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Update a notification by ID
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateAllNotificationIsRead = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.params.id,
    });
    if (!notifications) {
      return res.status(404).json({ message: "User don't have notification" });
    }

    await notifications.updateMany({
      $set: { is_read: true },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Update a notification by ID
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateNotificationIsRead = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_read = true;

    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Update a notification by ID
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateAllNotificationIsSeen = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.params.id,
    });
    if (!notifications) {
      return res.status(404).json({ message: "User don't have notification" });
    }

    await notifications.updateMany({
      $set: { is_new: false },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Update a notification by ID
 * @route PUT /api/notifications/:id
 * @access Private
 */
const updateNotificationIsSeen = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_new = false;

    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getAllNotificationsOfUser,
  getNotificationById,
  createNotification,
  updateAllNotificationIsRead,
  updateNotificationIsRead,
  updateAllNotificationIsSeen,
  updateNotificationIsSeen,
};

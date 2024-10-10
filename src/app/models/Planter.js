const mongoose = require("mongoose");
const PlantStatusEnum = require("../../enum/PlantStatusEnum");

const planterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    img_object: [
      {
        img_url: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    video_url: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    introduction: {
      type: String,
    },
    material: {
      type: String,
    },
    special_feature: {
      type: String,
    },
    style: {
      type: String,
    },
    planter_form: {
      type: String,
    },
    about: {
      type: String,
    },
    describe: {
      type: String,
    },
    default_color: {
      type: String,
    },
    theme: {
      type: String,
    },
    finish_type: {
      type: String,
    },
    item_weight: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    ASIN: {
      type: String,
    },
    item_model_number: {
      type: String,
    },
    customer_reviews: {
      default: 0,
      type: Number,
    },
    best_seller_rank: {
      type: String,
    },
    date_first_available: {
      type: Date,
    },
    status: {
      type: String,
      default: PlantStatusEnum.IN_STOCK,
    },
    average_rating: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Planter", planterSchema);

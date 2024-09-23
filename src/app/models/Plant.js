const mongoose = require("mongoose");

const plantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sub_name: {
      type: String,
      required: true,
    },
    genus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genus",
      required: true,
    },
    img_url: {
      type: [String],
      required: true,
    },
    video_url: {
      type: [String],
    },
    quantity: {
      type: Number,
    },
    height: {
      type: String,
    },
    width: {
      type: String,
    },
    zones: {
      type: String,
    },
    uses: {
      type: String,
    },
    tolerance: {
      type: String,
    },
    bloom_time: {
      type: String,
    },
    light: {
      type: String,
    },
    moisture: {
      type: String,
    },
    maintenance: {
      type: String,
    },
    growth_rate: {
      type: String,
    },
    plant_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantType",
      required: true,
    },
    plant_seasonal_interest: {
      type: String,
    },
    describe: {
      type: String,
    },
    noteworthy_characteristics: {
      type: String,
    },
    care: {
      type: String,
    },
    propagation: {
      type: String,
    },
    problems: {
      type: String,
    },
    water: {
      type: String,
    },
    humidity: {
      type: String,
    },
    fertilizer: {
      type: String,
    },
    size: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    average_rating: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);

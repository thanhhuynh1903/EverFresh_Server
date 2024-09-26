const { unique } = require("jquery");
const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema(
  {
    list_plant_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
      },
    ],
    collection_name: {
      type: String,
      unique: true,
      required: true,
    },
    collection_img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);

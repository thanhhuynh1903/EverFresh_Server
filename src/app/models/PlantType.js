const mongoose = require("mongoose");

const plantTypeSchema = mongoose.Schema(
  {
    plant_type_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PlantType", plantTypeSchema);

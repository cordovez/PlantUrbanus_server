const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema(
  {
    commonName: {
      type: String,
      required: true,
    },
    datePurchased: Date,
    substrate: String,
    healthRating: Number,
    scientificName: String,
    familyName: String,
    public_id: String,

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", PlantSchema);

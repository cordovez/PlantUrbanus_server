const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  commonName: String,
  datePurchased: Date,
  substrate: String,
  healthRating: Number,
  scientificName: String,
  familyName: String,
  public_id: String,
  ownerIds: [String],
});

module.exports = mongoose.model("Plant", PlantSchema);

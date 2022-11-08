const mongoose = require("mongoose");

const PropagationSchema = new mongoose.Schema({
  method: String,
  commonName: String,
  dateTaken: Date,
  scientificName: String,
  familyName: String,
  public_id: String,
  ownerIds: [String],
});

module.exports = mongoose.model("Propagation", PropagationSchema);

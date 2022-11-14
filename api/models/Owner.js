const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
    },
    avatar: {
      type: String,
    },
    plants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plant" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", OwnerSchema);

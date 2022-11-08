const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "PlantUrbanus",
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host} 🚀`);
  } catch (error) {
    const db = mongoose.connection;
    // errors after initial connection
    db.on("error", (err) => {
      console.log("error after initial connection: ", err);
    });
    // initial connection errors
    console.log("initial connection error: ", error);
  }
};
module.exports = connectDB;

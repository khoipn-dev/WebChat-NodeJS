import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect to MongoDB
 */
var connectDB = () => {
  mongoose.Promise = bluebird;
  // Connect String
  // let URI = `${process.env.DB_CONNECTION}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  console.log(URI);
  return mongoose.connect(URI);
};

module.exports = connectDB;
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const DB_URL = process.env.MONGODB_URL;

const connection = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(DB_URL, {
    });
    console.log("App connected to database ✔");
  } catch (err) {
    console.log(err);
  }
};

export default connection;

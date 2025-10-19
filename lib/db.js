import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error("Mongodb url not found!");
    }
    mongoose.connection.on("connected", () => console.log(`🚀 DB connected`));
    await mongoose.connect(MONGODB_URL, { dbName: "quick-chat" });
  } catch (error) {
    console.log(`❌ someting went wrong - ${error}`);
  }
};

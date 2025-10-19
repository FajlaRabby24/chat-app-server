// utils/connectDB.js
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// ====== Global cache (to reuse connection in dev/hot reload)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// ====== Connect Function
export const connectDB = async () => {
  if (cached.conn) return cached.conn; // ✅ Return existing connection

  if (!MONGODB_URL) {
    throw new Error("❌ Missing MongoDB URL");
  }

  // ✅ Use existing promise if connection in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "quick-chat",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("🚀 Database connected successfully");
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  return cached.conn;
};

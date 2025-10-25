import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    if (!uri) throw new Error("MongoDB URI not found in environment variables");

    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB (${process.env.NODE_ENV} mode)`);

  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
}
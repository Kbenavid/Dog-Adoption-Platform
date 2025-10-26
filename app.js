import "dotenv/config"; // Load environment variables from .env
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import dogRoutes from "./routes/dogs.routes.js";

// 🟢 --- DEBUG LOG: confirm app.js is loading ---
console.log("🟢 app.js loaded, NODE_ENV =", process.env.NODE_ENV);

const app = express();

// Global middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Mount routes
app.use("/auth", authRoutes); // /auth/register, /auth/login
app.use("/dogs", dogRoutes);  // /dogs (protected)

// Health check route
app.get("/health", (req, res) => res.json({ status: "OK" }));

// 🟡 --- Database Connection ---
console.log("➡️  Connecting to MongoDB...");
connectDB()
  .then(() => console.log("✅ connectDB() resolved"))
  .catch(err => console.error("❌ connectDB() error:", err.message));

// 🟣 --- Server Setup ---
const PORT = process.env.PORT || 5001;

// ✅ Only start the server if NOT in test mode
if (process.env.NODE_ENV !== "test") {
  console.log("➡️  Starting Express server on port", PORT);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  console.log("🚫 Skipping app.listen() because NODE_ENV=test");
}

// ✅ Export app for Mocha tests
export default app;
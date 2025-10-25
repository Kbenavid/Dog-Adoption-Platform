import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login (we’ll add later)
router.post("/login", loginUser);

export default router;
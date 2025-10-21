import jwt from "jsonwebtoken"; // used for generating JWT tokens
import User from "../models/user.js"; // Import the User model'

// REGISTER NEW USER
export const register = async (req, res) => {
    try{
        const {username, pasword } = req.body; // get username and password from request body
        if (!username || !password) {
            return res.status(400).son({ error: "username and password are required" });   
        }
        const existingUser = await user.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "username already taken" }); // check for existing user
        }
        const passwordHash = await user.hashPassword(password); // hash the password
        const user = await user.create({ username, passwordHash }); // create new user
        res.status(201).json({
            id: user._id,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// LOGIN EXISTING USER
export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }
  
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
  
      // Compare the provided password with the hashed password in DB
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
  
      // Generate a signed JWT token valid for 24 hours
      const token = jwt.sign(
        { sub: user._id, username: user.username }, // token payload
        process.env.JWT_SECRET,                     // secret key from .env
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );
  
      // Return token to client
      res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ error: "Server error during login." });
    }
  };
import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import { connectDB } from ' ./db.js'; // Import the database connection function
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Sample route
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log('Server running on port ${PORT}'));

import mongoose from 'mongoose';
export async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
        if (mongoUri) {
            throw new Error('MONGODB_URI is not defined in your .env file');
        }

        await mongoose.connect(mongoUri, { useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log ('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}   
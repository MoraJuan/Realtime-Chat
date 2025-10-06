import mongoose from 'mongoose';

export const connectDB = async (mongoURI) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Example usage (uncomment to use):
// connectDB('your-mongodb-uri-here');

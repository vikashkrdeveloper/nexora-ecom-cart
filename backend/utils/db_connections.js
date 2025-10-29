import mongoose from 'mongoose';
import { DB_CONFIG } from '../config/index.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(DB_CONFIG.uri, DB_CONFIG.options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};


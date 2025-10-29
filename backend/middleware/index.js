import express from 'express';
import cors from 'cors';
import { connectDB } from '../utils/db_connections.js';
import producsts from '../routes/products.js';
import cart from '../routes/cart.js';
import checkout from '../routes/checkout.js';
import { SERVER_CONFIG } from '../config/index.js';

export const globalMiddlewares = (app) => {
    app.use(cors());
    app.use(express.json()); // 
    app.use(express.urlencoded({ extended: true })); // This line to parse URL-encoded bodies

    // MongoDB Connection
    connectDB();

    // API Routes
    apiRoutes(app);
}

export const apiRoutes = (app) => {
    app.use('/api/products', producsts);
    app.use('/api/cart', cart);
    app.use('/api/checkout', checkout);
    app.get('/api/health', (req, res) => {
        res.json({ status: 'OK', message: 'Nexora API is running!', timestamp: new Date(), env: SERVER_CONFIG.node_env === "development" ? "development" : "Local" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            error: 'Something went wrong!',
            message: SERVER_CONFIG.node_env === 'development' ? err.message : 'Internal server error'
        });
    });

    // 404 handler
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
}
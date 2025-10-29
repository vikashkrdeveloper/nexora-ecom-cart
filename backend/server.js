import express from 'express';
import { globalMiddlewares } from './middleware/index.js';
import { SERVER_CONFIG } from './config/index.js';


const app = express();

// Apply global middlewares & routes
globalMiddlewares(app);

app.listen(SERVER_CONFIG.port, () => {
    console.log(`🚀 Server running on port ${SERVER_CONFIG.port}`);
    console.log(`📍 Running API check: http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}/api/health`);
});

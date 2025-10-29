import "dotenv/config";

export const DB_CONFIG = {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_shopping_cart',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

export const SERVER_CONFIG = {
    port: process.env.PORT || 5000,
    node_env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
};
export const CHECKOUT_CONFIG = {
    expectedDeliveryTimeAfterPlaceOrder: 7, // in days
};
import Product from '../models/Product.js';

const mockProducts = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        description: "Track your fitness goals with this advanced smartwatch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Organic Coffee Beans",
        price: 24.99,
        description: "Premium organic coffee beans from sustainable farms",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
        category: "Food & Beverages"
    },
    {
        id: 4,
        name: "Designer Backpack",
        price: 89.99,
        description: "Stylish and functional backpack for everyday use",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        category: "Fashion"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 79.99,
        description: "Portable speaker with excellent sound quality",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 49.99,
        description: "Non-slip yoga mat for your workout sessions",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        category: "Sports & Fitness"
    },
    {
        id: 7,
        name: "Ceramic Plant Pot",
        price: 34.99,
        description: "Beautiful ceramic pot perfect for indoor plants",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop",
        category: "Home & Garden"
    },
    {
        id: 8,
        name: "LED Desk Lamp",
        price: 59.99,
        description: "Adjustable LED desk lamp with multiple brightness levels",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        category: "Home & Office"
    },
];

const initializeProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(mockProducts);
            console.log('Mock products initialized in database');
        }
    } catch (error) {
        console.error('Error initializing products:', error);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        await initializeProducts();
        const products = await Product.find().sort({ id: 1 });
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
};

import { CHECKOUT_CONFIG } from '../config/index.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const USER_ID = 'guest_user';

export const processCheckout = async (req, res) => {
    try {
        const { customerName, customerEmail } = req.body;

        if (!customerName || !customerEmail) {
            return res.status(400).json({
                success: false,
                error: 'Customer name and email are required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }

        const cart = await Cart.findOne({ userId: USER_ID });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Manually lookup products instead of using populate
        const orderItems = [];
        for (const item of cart.items) {
            const product = await Product.findOne({ id: item.productId });
            if (product) {
                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                });
            }
        }

        const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            orderId,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim().toLowerCase(),
            items: orderItems,
            total: total
        });

        await order.save();

        cart.items = [];
        await cart.save();

        const receipt = {
            orderId: order.orderId,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            items: order.items,
            total: order.total,
            timestamp: order.createdAt,
            status: order.status,
            estimatedDelivery: new Date(Date.now() + CHECKOUT_CONFIG.expectedDeliveryTimeAfterPlaceOrder * 24 * 60 * 60 * 1000)
        };

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: receipt
        });

    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process checkout'
        });
    }
};


import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        ref: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});
const Order = mongoose.model('Order', orderSchema);

export default Order;

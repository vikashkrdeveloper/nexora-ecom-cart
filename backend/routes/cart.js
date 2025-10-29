import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);

// Update item quantity
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

export default router;

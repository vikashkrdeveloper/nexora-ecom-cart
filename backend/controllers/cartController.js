import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const USER_ID = 'guest_user';

const getFormattedCartData = async () => {
    const cart = await Cart.findOne({ userId: USER_ID });

    if (!cart) {
        return {
            items: [],
            total: 0,
            itemCount: 0
        };
    }

    // Manually lookup products instead of using populate
    const formattedItems = [];
    for (const item of cart.items) {
        const product = await Product.findOne({ id: item.productId });
        if (product) {
            formattedItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
                category: product.category
            });
        }
    }

    const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = formattedItems.reduce((sum, item) => sum + item.quantity, 0);

    cart.total = total;
    await cart.save();

    return {
        items: formattedItems,
        total: total,
        itemCount: itemCount
    };
};

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: USER_ID });
        if (!cart) {
            cart = new Cart({ userId: USER_ID, items: [] });
            await cart.save();
        }

        const cartData = await getFormattedCartData();

        res.json({
            success: true,
            data: cartData
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart'
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        // Find Product to validate it exists
        const product = await Product.findOne({ id: parseInt(productId) }).lean();
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        let cart = await Cart.findOne({ userId: USER_ID });
        if (!cart) {
            cart = new Cart({ userId: USER_ID, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({
                productId: parseInt(productId),
                quantity: parseInt(quantity)
            });
        }

        await cart.save();

        const cartData = await getFormattedCartData();

        res.json({
            success: true,
            message: 'Item added to cart successfully',
            data: cartData
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item to cart'
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                error: 'Valid quantity is required'
            });
        }

        const cart = await Cart.findOne({ userId: USER_ID });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        cart.items[itemIndex].quantity = parseInt(quantity);
        await cart.save();

        const cartData = await getFormattedCartData();

        res.json({
            success: true,
            message: 'Cart updated successfully',
            data: cartData
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart'
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId: USER_ID });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.productId !== parseInt(productId));
        await cart.save();

        const cartData = await getFormattedCartData();

        res.json({
            success: true,
            message: 'Item removed from cart successfully',
            data: cartData
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove item from cart'
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: USER_ID });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            success: true,
            message: 'Cart cleared successfully',
            data: {
                items: [],
                total: 0,
                itemCount: 0
            }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart'
        });
    }
};

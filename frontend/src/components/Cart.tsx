import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useDebounce } from "../hooks/useDebounce";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

interface CartProps {
  onOpenCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onOpenCheckout }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading } =
    useCart();
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  const debouncedUpdateQuantity = useDebounce(
    (async (productId: number, quantity: number) => {
      try {
        await updateQuantity(productId, quantity);
      } catch (error) {
        console.error("Failed to update quantity:", error);
      } finally {
        setUpdatingItem(null);
      }
    }) as (...args: unknown[]) => Promise<void>,
    500
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItem(productId);
    debouncedUpdateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      setUpdatingItem(productId);
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Shopping Cart
          </h2>
          <button
            onClick={handleClearCart}
            disabled={isLoading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-all duration-200"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/100x100?text=No+Image";
                }}
              />

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-900 font-semibold">
                    ₹{item.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={
                        updatingItem === item.productId || item.quantity <= 1
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-[32px] text-center font-medium text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      disabled={updatingItem === item.productId}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">
                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={updatingItem === item.productId}
                    className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    {updatingItem === item.productId ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 h-fit sticky top-24">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal ({cart.itemCount} items)
            </span>
            <span className="font-medium">₹{cart.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <hr className="border-gray-200 my-3" />
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{cart.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onOpenCheckout}
          disabled={cart.items.length === 0}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

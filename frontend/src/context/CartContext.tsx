import React, {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { CartData, Product } from "../types";
import { apiService } from "../services/api";

interface CartContextType {
  cart: CartData;
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

interface CartState {
  cart: CartData;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartData }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: CartState = {
  cart: { items: [], total: 0, itemCount: 0 },
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cartData = await apiService.getCart();
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to load cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cartData = await apiService.addToCart(product.id, quantity);
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to add to cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cartData = await apiService.updateCartItem(productId, quantity);
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cartData = await apiService.removeFromCart(productId);
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to remove from cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cartData = await apiService.clearCart();
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to clear cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

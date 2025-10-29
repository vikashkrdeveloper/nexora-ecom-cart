import React, { useState, useEffect } from "react";
import type { Product } from "../types";
import { apiService } from "../services/api";
import { useCart } from "../hooks/useCart";
import { useDebounce } from "../hooks/useDebounce";
import { Loader2 } from "lucide-react";

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProducts, setUpdatingProducts] = useState<Set<number>>(
    new Set()
  );

  const { cart, addToCart, updateQuantity, isLoading: cartLoading } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductQuantity = (productId: number): number => {
    const cartItem = cart.items.find((item) => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const debouncedUpdateQuantity = useDebounce(
    (async (productId: number, quantity: number) => {
      try {
        await updateQuantity(productId, quantity);
      } catch (err) {
        console.error("Failed to update quantity:", err);
      } finally {
        setUpdatingProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }) as (...args: unknown[]) => Promise<void>,
    400
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdatingProducts((prev) => new Set(prev).add(productId));
    debouncedUpdateQuantity(productId, newQuantity);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8 mb-3" />
        <p className="text-gray-600 text-lg font-medium">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Our Products
        </h2>
        <p className="text-gray-500 mt-2 text-base">
          Browse the latest premium items curated for you.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const quantity = getProductQuantity(product.id);
          const isUpdating = updatingProducts.has(product.id);

          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x300?text=No+Image")
                  }
                />
                {quantity > 0 && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {quantity} in cart
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col justify-between h-[250px]">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{product.price.toFixed(2)}
                  </span>

                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={cartLoading}
                      className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-60"
                    >
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, quantity - 1)
                        }
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition"
                      >
                        -
                      </button>
                      <span className="text-base font-semibold text-gray-800 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, quantity + 1)
                        }
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;

import type {
  Product,
  CartData,
  CheckoutForm,
  OrderReceipt,
  ApiResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await this.fetchApi<ApiResponse<Product[]>>("/products");
    return response.data || [];
  }

  // Cart
  async getCart(): Promise<CartData> {
    const response = await this.fetchApi<ApiResponse<CartData>>("/cart");
    return response.data || { items: [], total: 0, itemCount: 0 };
  }

  async addToCart(productId: number, quantity: number = 1): Promise<CartData> {
    const response = await this.fetchApi<ApiResponse<CartData>>("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data || { items: [], total: 0, itemCount: 0 };
  }

  async updateCartItem(productId: number, quantity: number): Promise<CartData> {
    const response = await this.fetchApi<ApiResponse<CartData>>(
      `/cart/update/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }
    );
    return response.data || { items: [], total: 0, itemCount: 0 };
  }

  async removeFromCart(productId: number): Promise<CartData> {
    const response = await this.fetchApi<ApiResponse<CartData>>(
      `/cart/remove/${productId}`,
      {
        method: "DELETE",
      }
    );
    return response.data || { items: [], total: 0, itemCount: 0 };
  }

  async clearCart(): Promise<CartData> {
    const response = await this.fetchApi<ApiResponse<CartData>>("/cart/clear", {
      method: "DELETE",
    });
    return response.data || { items: [], total: 0, itemCount: 0 };
  }

  // Checkout
  async checkout(checkoutData: CheckoutForm): Promise<OrderReceipt> {
    const response = await this.fetchApi<ApiResponse<OrderReceipt>>(
      "/checkout",
      {
        method: "POST",
        body: JSON.stringify(checkoutData),
      }
    );
    if (!response.data) {
      throw new Error("Checkout failed");
    }
    return response.data;
  }
}

export const apiService = new ApiService();

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock?: number;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface CartData {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CheckoutForm {
  customerName: string;
  customerEmail: string;
}

export interface OrderReceipt {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  timestamp: string;
  status: string;
  estimatedDelivery: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

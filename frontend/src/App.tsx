import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import ReceiptModal from "./components/ReceiptModal";
import type { OrderReceipt } from "./types";

function App() {
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleOrderComplete = (orderReceipt: OrderReceipt) => {
    setReceipt(orderReceipt);
    setIsCheckoutModalOpen(false);
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
  };

  const handleOpenCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false);
  };

  return (
    <CartProvider>
      <Router>
          <Header onOpenCheckout={handleOpenCheckout} />
        <div className="min-h-screen flex flex-col bg-gray-50">
          <main className="flex-1 py-8">
            <Routes>
              <Route path="/" element={<ProductGrid />} />
              <Route path="/cart" element={<Cart onOpenCheckout={handleOpenCheckout} />} />
            </Routes>
          </main>
          <CheckoutModal 
            isOpen={isCheckoutModalOpen}
            onClose={handleCloseCheckout}
            onOrderComplete={handleOrderComplete}
          />
          <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

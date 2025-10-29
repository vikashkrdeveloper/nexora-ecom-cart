import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { ShoppingCart, Home, CreditCard, Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenCheckout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCheckout }) => {
  const { cart } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItemClasses = (path: string) =>
    `flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "text-blue-600 bg-blue-100/70 font-semibold"
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    }`;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-3">
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="flex flex-col leading-tight">
            <h1 className="text-[34px] sm:text-[38px] leading-[36px] font-bold text-gray-900 tracking-tight">
              Nexora
            </h1>
            <p className="text-[12px] text-gray-500 font-medium">
              Your Shopping Paradise
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link to="/" className={navItemClasses("/")}>
            <Home size={18} strokeWidth={2} />
            <span>Products</span>
          </Link>

          <Link to="/cart" className={`relative ${navItemClasses("/cart")}`}>
            <ShoppingCart size={18} strokeWidth={2} />
            <span>Cart</span>
            {cart.itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cart.itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={onOpenCheckout}
            disabled={cart.itemCount === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[15px] transition-all duration-200 ${
              cart.itemCount === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <CreditCard size={18} strokeWidth={2} />
            <span>Checkout</span>
          </button>
        </nav>

        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md animate-slideDown">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={navItemClasses("/")}
            >
              <Home size={18} strokeWidth={2} />
              <span>Products</span>
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={`relative ${navItemClasses("/cart")}`}
            >
              <ShoppingCart size={18} strokeWidth={2} />
              <span>Cart</span>
              {cart.itemCount > 0 && (
                <span className="absolute top-1 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                onOpenCheckout();
                setMenuOpen(false);
              }}
              disabled={cart.itemCount === 0}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-semibold text-[15px] transition-all duration-200 ${
                cart.itemCount === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <CreditCard size={18} strokeWidth={2} />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

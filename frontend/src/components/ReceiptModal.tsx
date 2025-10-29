import React, { useEffect } from "react";
import type { OrderReceipt } from "../types";
import { CheckCircle2, X, Printer, FileText } from "lucide-react";

interface ReceiptModalProps {
  receipt: OrderReceipt | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  useEffect(() => {
    if (!receipt) {
      document.body.style.overflow = "auto";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [receipt, onClose]);
  if (!receipt) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn scrollbar-hide"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Order Confirmation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Order Placed Successfully
            </h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Thank you for your purchase,{" "}
              <span className="font-medium text-gray-900">
                {receipt.customerName}
              </span>
              !
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Order Information
            </h4>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 text-sm sm:text-base text-gray-700">
              {[
                ["Order ID", receipt.orderId],
                ["Date", formatDate(receipt.timestamp)],
                [
                  "Status",
                  <span
                    key="status"
                    className="text-green-600 font-semibold capitalize"
                  >
                    {receipt.status}
                  </span>,
                ],
                ["Estimated Delivery", formatDate(receipt.estimatedDelivery)],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium">{label}:</span>
                  <span className="text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Customer Information
            </h4>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 text-sm sm:text-base text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{receipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="truncate">{receipt.customerEmail}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Order Items
            </h4>
            <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
              {receipt.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 px-4 text-sm sm:text-base text-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-lg sm:text-xl font-semibold text-gray-900 border-t border-gray-200 pt-4">
            <span>Total Amount</span>
            <span className="text-blue-600">₹{receipt.total.toFixed(2)}</span>
          </div>

          <div className="text-center text-sm sm:text-base text-gray-600 border-t border-gray-200 pt-4">
            <p className="mt-1">
              Track your order using ID:{" "}
              <span className="font-semibold text-gray-900">
                {receipt.orderId}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white font-medium hover:bg-gray-100 transition-all"
            >
              <Printer size={18} />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

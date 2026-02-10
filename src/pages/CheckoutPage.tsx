import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { CreditCard, Banknote } from "lucide-react";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [processing, setProcessing] = useState(false);

  if (!user || items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) return;
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500));
    const order = placeOrder({
      userId: user.id,
      items,
      total: total > 500 ? total : total + 49,
      paymentMethod,
      address,
    });
    clearCart();
    navigate("/order-success", { state: { orderId: order.id } });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <div className="space-y-6">
        {/* Address */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Delivery Address</h2>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your full delivery address..."
            rows={3}
            className="w-full p-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Payment */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod("COD")}
              className={`flex items-center gap-3 p-4 rounded-md border-2 transition-colors ${paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-input"}`}
            >
              <Banknote size={20} className="text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm text-foreground">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when you receive</p>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("Online")}
              className={`flex items-center gap-3 p-4 rounded-md border-2 transition-colors ${paymentMethod === "Online" ? "border-primary bg-primary/5" : "border-input"}`}
            >
              <CreditCard size={20} className="text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm text-foreground">Online Payment</p>
                <p className="text-xs text-muted-foreground">Demo card payment</p>
              </div>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">{product.name} × {quantity}</span>
              <span className="text-foreground font-medium">${product.price * quantity}</span>
            </div>
          ))}
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>${total > 500 ? total : total + 49}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={!address.trim() || processing}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium btn-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</> : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

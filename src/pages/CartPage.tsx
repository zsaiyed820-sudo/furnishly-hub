import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Start shopping to add items to your cart.</p>
        <Link to="/products" className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium btn-transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-card border border-border rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="font-bold text-foreground mt-1">${product.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-7 h-7 rounded border border-input flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-7 h-7 rounded border border-input flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
          <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>${total}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span><span>{total > 500 ? "Free" : "$49"}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base">
              <span>Total</span><span>${total > 500 ? total : total + 49}</span>
            </div>
          </div>
          {user ? (
            <Link to="/checkout" className="block mt-6 bg-primary text-primary-foreground text-center py-3 rounded-md font-medium btn-transition">
              Proceed to Checkout
            </Link>
          ) : (
            <Link to="/login" className="block mt-6 bg-primary text-primary-foreground text-center py-3 rounded-md font-medium btn-transition">
              Login to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

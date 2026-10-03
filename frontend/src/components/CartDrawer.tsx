import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DeliveryLocation } from '../types';

interface CartDrawerProps {
  currentLocation: DeliveryLocation;
}

export function CartDrawer({ currentLocation }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal >= 199 || cartTotal === 0 ? 0 : 29;
  const handlingFee = cartTotal > 0 ? 15 : 0;
  const grandTotal = cartTotal + deliveryFee + handlingFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        setOrderPlaced(false);
        setIsCartOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-novagreen-700" />
              <div>
                <h2 className="text-base font-bold text-gray-950">
                  Your Cart
                </h2>
                <p className="text-xs text-gray-500">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderPlaced ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-novagreen-100 flex items-center justify-center text-novagreen-700 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-950">
                  Order Confirmed!
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Your NovaMart order is being packed at the {currentLocation.area} dark store. Arriving in {currentLocation.eta}!
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#f4f7f4] flex items-center justify-center text-novagreen-600 mb-2">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Explore fresh strawberries, cold-pressed olive oil, audio gear, and air fryers!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-novagreen-700 hover:bg-novagreen-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hyperlocal Delivery Banner */}
                <div className="bg-[#eaf6ec] border border-[#d2edd7] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-novagreen-700 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-novagreen-950">
                      Delivering in {currentLocation.eta}
                    </p>
                    <p className="text-[11px] text-novagreen-800">
                      To {currentLocation.area}, {currentLocation.city}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="py-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-contain bg-[#fafafa] rounded-xl p-1 border border-gray-100 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-950 leading-tight">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {product.subtitle}
                          </p>
                          <p className="text-xs font-bold text-gray-950 mt-1">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper & Delete */}
                      <div className="flex items-center gap-2">
                        <div className="bg-[#1c7b39] text-white text-xs font-semibold rounded-lg flex items-center px-1.5 py-1 shadow-xs">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 hover:bg-black/20 rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold px-2 text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 hover:bg-black/20 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-xs text-gray-600">
                  <h4 className="font-bold text-gray-950 text-sm mb-3">
                    Bill Summary
                  </h4>
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-medium text-gray-900">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="font-medium text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-novagreen-700 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling & Packaging</span>
                    <span className="font-medium text-gray-900">
                      ₹{handlingFee}
                    </span>
                  </div>
                  <div className="border-t border-gray-200/80 pt-2.5 flex justify-between text-sm font-extrabold text-gray-950">
                    <span>To Pay</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {items.length > 0 && !orderPlaced && (
            <div className="p-4 bg-white border-t border-gray-100">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#1c7b39] hover:bg-[#156d30] disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-between transition-colors shadow-md focus:outline-none"
              >
                <span>
                  {isCheckingOut ? 'Processing Order...' : 'Proceed to Checkout'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

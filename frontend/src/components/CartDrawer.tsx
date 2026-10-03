import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Package,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DeliveryLocation, PlacedOrder } from '../types';
import { createOrderFromCart, saveOrder } from '../data/orderHelper';

interface CartDrawerProps {
  currentLocation: DeliveryLocation;
}

export function CartDrawer({ currentLocation }: CartDrawerProps) {
  const navigate = useNavigate();
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
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal >= 199 || cartTotal === 0 ? 0 : 29;
  const handlingFee = cartTotal > 0 ? 15 : 0;
  const grandTotal = cartTotal + deliveryFee + handlingFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      const order = createOrderFromCart(items, cartTotal, currentLocation);
      saveOrder(order);
      setConfirmedOrder(order);
      clearCart();
      setIsCheckingOut(false);
    }, 1000);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setConfirmedOrder(null);
  };

  const handleTrackOrder = () => {
    setIsCartOpen(false);
    setConfirmedOrder(null);
    navigate('/order-confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              {confirmedOrder ? (
                <div className="w-8 h-8 rounded-full bg-[#eaf6ec] text-[#198038] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <ShoppingBag className="w-5 h-5 text-novagreen-700" />
              )}
              <div>
                <h2 className="text-base font-bold text-gray-950">
                  {confirmedOrder ? 'Order Confirmed' : 'Your Cart'}
                </h2>
                <p className="text-xs text-gray-500">
                  {confirmedOrder
                    ? `#${confirmedOrder.orderNumber}`
                    : `${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {confirmedOrder ? (
              /* ORDER CONFIRMED VIEW WITH ORDER DATA & TRACK OPTION */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Status Hero Card */}
                <div className="text-center bg-[#eef8f1] border border-[#c4ebd3] rounded-2xl p-5">
                  <div className="w-14 h-14 rounded-full bg-[#198038] text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-950 mt-3 tracking-tight">
                    Order Confirmed!
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                    Your NovaMart order is being packed at the {confirmedOrder.location.area} dark store. Arriving in {confirmedOrder.estimatedArrival}!
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#c4ebd3]/60 flex items-center justify-around text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#125A27]">
                      <Clock className="w-3.5 h-3.5" /> {confirmedOrder.estimatedArrival}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#198038]" />
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-[#198038]" /> {confirmedOrder.location.area}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#198038]" />
                    <span className="font-mono font-bold text-[11px] text-gray-600">
                      #{confirmedOrder.orderNumber}
                    </span>
                  </div>
                </div>

                {/* Ordered Items Summary */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#198038]" />
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Items Ordered ({confirmedOrder.itemCount})
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-[#198038] bg-[#eef8f1] px-2 py-0.5 rounded-full">
                      Packing
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {confirmedOrder.items.map(({ product, quantity }) => (
                      <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1 border border-gray-100 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-gray-950 truncate">
                              {product.name}
                            </h5>
                            <p className="text-[11px] text-gray-500 truncate">
                              {product.subtitle}
                            </p>
                            <span className="inline-block mt-0.5 text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded">
                              Qty: {quantity}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-gray-950 block">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ₹{product.price.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown of Placed Order */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-600 border border-gray-100">
                  <h4 className="font-bold text-gray-950 text-xs uppercase tracking-wider mb-2">
                    Payment & Bill Summary
                  </h4>
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900">
                      ₹{confirmedOrder.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="font-bold text-[#198038]">
                      {confirmedOrder.deliveryFee === 0 ? 'FREE' : `₹${confirmedOrder.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling & Packaging</span>
                    <span className="font-semibold text-gray-900">
                      ₹{confirmedOrder.handlingFee}
                    </span>
                  </div>
                  <div className="border-t border-gray-200/80 pt-2 flex justify-between text-sm font-extrabold text-gray-950">
                    <span>Total Paid</span>
                    <span className="text-[#198038]">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right mt-0.5">
                    Paid via {confirmedOrder.paymentMethod}
                  </p>
                </div>
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
                  onClick={handleClose}
                  className="mt-2 bg-novagreen-700 hover:bg-novagreen-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
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
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-contain bg-[#fafafa] rounded-xl p-1 border border-gray-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-950 leading-tight truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {product.subtitle}
                          </p>
                          <p className="text-xs font-bold text-gray-950 mt-1">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-[#1c7b39] text-white text-xs font-semibold rounded-lg flex items-center px-1.5 py-1 shadow-xs">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 hover:bg-black/20 rounded transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold px-2 text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 hover:bg-black/20 rounded transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
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

          {/* Footer CTAs */}
          {confirmedOrder ? (
            /* BUTTONS AFTER ORDER IS CONFIRMED */
            <div className="p-4 bg-white border-t border-gray-100 space-y-2">
              <button
                onClick={handleTrackOrder}
                className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg"
              >
                <Truck className="w-5 h-5" />
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length > 0 ? (
            <div className="p-4 bg-white border-t border-gray-100">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#1c7b39] hover:bg-[#156d30] disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-between transition-colors shadow-md focus:outline-none cursor-pointer"
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

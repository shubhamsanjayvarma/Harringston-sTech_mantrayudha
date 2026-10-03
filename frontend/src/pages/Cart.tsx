import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Info, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Minus, 
  Plus, 
  Trash2, 
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const deliveryFee = cartTotal >= 199 || cartTotal === 0 ? 0 : 29;
  const handlingFee = cartTotal > 0 ? 15 : 0;
  const discount = promoApplied ? 500 : 0;
  const total = Math.max(0, cartTotal + deliveryFee + handlingFee - discount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME500') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Your cart</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your cart</h1>
        <p className="text-lg text-gray-600 mt-1">
          {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for delivery
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#f4f7f4] text-[#198038] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is currently empty</h2>
          <p className="text-sm text-gray-500 mb-6">
            Explore fresh fruits, groceries, smart electronics, home appliances, and personal care essentials.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-sm shadow-xs"
          >
            Start Shopping <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-xl shrink-0 p-2 overflow-hidden flex items-center justify-center border border-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.subtitle}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-0.5 rounded-md border border-[#c4ebd3]">
                    <span className="text-[#198038]">⚡</span> {product.deliveryTime || '10-15 mins'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                  <span className="text-xl font-extrabold text-gray-950">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 bg-white shadow-2xs">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="px-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-gray-900">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="px-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium cursor-pointer"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Delivery address banner */}
            <div className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center bg-white shadow-xs">
              <div className="flex gap-3 items-center">
                <div className="bg-[#eef8f1] p-2.5 rounded-full text-[#198038]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Delivering to Home</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Indiranagar, Bengaluru 560038</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/account?tab=addresses')}
                className="text-[#198038] font-semibold text-xs hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Summary Box */}
            <div className="bg-[#f8f6f2] rounded-2xl p-6 border border-[#e8e4db]">
              <h2 className="text-xl font-bold text-gray-900 mb-5 tracking-tight">Order summary</h2>

              <div className="space-y-3.5 text-gray-700 text-sm font-medium mb-6">
                <div className="flex justify-between">
                  <span>Item Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Delivery fee <Info size={14} className="text-gray-400" />
                  </span>
                  <span className="font-bold text-[#198038]">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Handling & Packaging</span>
                  <span className="font-bold text-gray-900">₹{handlingFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#198038]">
                    <span>Discount (WELCOME500)</span>
                    <span className="font-bold">- ₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-300 pt-4 mb-6 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#198038]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Enter coupon (e.g. WELCOME500)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#198038]"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-white border border-[#198038] text-[#198038] font-bold text-xs rounded-xl px-4 hover:bg-[#eef8f1] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              <button
                className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-bold rounded-xl py-3.5 transition-colors text-base flex items-center justify-center gap-2 mb-6 shadow-sm cursor-pointer"
                onClick={() => navigate('/checkout')}
              >
                Proceed to checkout <ChevronRight size={18} />
              </button>

              {/* Guarantees */}
              <div className="flex justify-between gap-2 pt-2 border-t border-gray-200/60">
                <div className="flex flex-col items-center gap-1 text-center w-1/3">
                  <ShieldCheck className="text-[#198038]" size={18} />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                    Secure<br />checkout
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center w-1/3">
                  <RotateCcw className="text-[#198038]" size={18} />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                    Easy<br />returns
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center w-1/3">
                  <Truck className="text-[#198038]" size={18} />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                    Fast<br />delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

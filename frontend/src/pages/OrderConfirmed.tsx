import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Truck, 
  MapPin, 
  Map as MapIcon, 
  Info, 
  ChevronRight, 
  Headset, 
  Package, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { getLatestOrder } from '../data/orderHelper';
import { PlacedOrder } from '../types';

export default function OrderConfirmed() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    const loaded = getLatestOrder();
    if (loaded) {
      setOrder(loaded);
    } else {
      // Default fallback if directly visited
      setOrder({
        id: 'order_default_demo',
        orderNumber: 'NM-261003-8419',
        createdAt: '03 Oct 2026',
        items: [
          {
            product: {
              id: 'el-1',
              name: 'ColorFit Pulse Smartwatch',
              subtitle: '1.85" HD display, Bluetooth calling & 100+ modes',
              price: 1999,
              originalPrice: 3499,
              deliveryTime: '10 mins',
              image: '/assets/smartwatch.jpg',
              category: 'Electronics',
              subcategory: 'Smart Wearables',
              brand: 'Noise',
              rating: 4.6,
            },
            quantity: 1,
          },
        ],
        itemCount: 1,
        subtotal: 1999,
        deliveryFee: 0,
        handlingFee: 15,
        total: 2014,
        location: {
          id: 'indiranagar',
          area: 'Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          eta: '10 mins',
        },
        status: 'Packing in dark store',
        estimatedArrival: '10 mins',
        paymentMethod: 'UPI / NovaPay',
      });
    }
  }, []);

  if (!order) return null;

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
              <span className="text-gray-900 font-medium">Order confirmed</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Tracking and Map */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Success Banner */}
          <div className="bg-[#eef8f1] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-[#c4ebd3]">
            <div className="bg-[#198038] text-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                Order placed successfully!
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-3">
                Thanks! Your order is confirmed and being packed at the {order.location.area} dark store.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-gray-800 text-sm bg-white/80 border border-gray-200 px-3 py-1 rounded-lg">
                  Order #{order.orderNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#c4ebd3] text-[#125A27] px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle size={14} /> Payment confirmed ({order.paymentMethod})
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Tracker */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038]">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Arriving today</h3>
                  <p className="text-gray-500 mt-0.5 text-sm flex items-center gap-1.5">
                    <Clock size={14} className="text-[#198038]" /> 
                    <span className="font-bold text-[#125A27]">{order.estimatedArrival}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <MapPin size={24} className="text-[#198038] shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {order.location.area}, {order.location.city}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    PIN {order.location.pincode} • Ultra-fast delivery
                  </p>
                </div>
                <button
                  onClick={() => navigate('/account?tab=orders')}
                  className="ml-auto sm:ml-4 bg-[#eef8f1] hover:bg-[#c4ebd3] text-[#125A27] font-semibold py-2 px-3.5 rounded-lg transition-colors text-xs whitespace-nowrap cursor-pointer"
                >
                  View all orders
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative mb-10 px-2 sm:px-4">
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0">
                <div className="w-[38%] h-full bg-[#198038] transition-all duration-500"></div>
              </div>
              <div className="relative z-10 flex justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">Order placed</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">Just now</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white] ring-2 ring-[#c4ebd3]">
                    2
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#198038]">Packing</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">Dark store processing</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    3
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">On the way</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">Delivery rider</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    4
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Delivered</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">At your doorstep</span>
                </div>
              </div>
            </div>

            {/* Live Delivery Route Map */}
            <div className="bg-[#f2f4f1] rounded-2xl h-52 relative overflow-hidden flex items-center justify-center border border-gray-200 shadow-inner">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(#d1d5db 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 120 130 Q 280 100 380 130 T 640 120" fill="none" stroke="#198038" strokeWidth="4" />
                <path d="M 640 120 Q 720 110 820 140" fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="8 8" />
              </svg>

              {/* Dark Store Node */}
              <div className="absolute left-[8%] sm:left-[12%] top-[35%] flex flex-col items-center bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xs mb-1 border border-gray-100 text-[#198038]">
                  <MapIcon size={18} />
                </div>
                <span className="text-[11px] font-bold text-gray-900">NovaMart Dark Store</span>
                <span className="text-[10px] text-gray-500">{order.location.area} Hub</span>
              </div>

              {/* Delivery Rider on Route */}
              <div className="absolute left-[44%] top-[50%] flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#198038] text-[#198038] z-10">
                  <Truck size={22} />
                </div>
                <span className="text-[10px] font-bold bg-[#198038] text-white px-2 py-0.5 rounded-full mt-1">
                  10m away
                </span>
              </div>

              {/* Customer Destination Node */}
              <div className="absolute right-[8%] sm:right-[12%] top-[40%] flex flex-col items-center bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#c4ebd3] shadow-sm">
                <div className="w-9 h-9 bg-[#eef8f1] rounded-full flex items-center justify-center shadow-xs mb-1 border border-[#c4ebd3] text-[#198038]">
                  <MapPin size={18} />
                </div>
                <span className="text-[11px] font-bold text-gray-900">Your Location</span>
                <span className="text-[10px] text-gray-500">{order.location.area}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3 text-gray-600 bg-[#f9faf9] p-4 rounded-xl border border-gray-100">
              <Info size={20} className="text-[#198038] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Rider is arriving at the dark store for instant pickup
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your order is packed in a hygienic temperature-controlled delivery bag.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real Dynamic Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-xs sticky top-24">
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order summary</h2>
                <p className="text-xs text-gray-500 mt-0.5">Placed on {order.createdAt}</p>
              </div>
              <span className="text-xs font-bold text-[#198038] bg-[#eef8f1] px-2.5 py-1 rounded-full border border-[#c4ebd3]">
                {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Dynamic Items List */}
            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3.5 items-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl shrink-0 p-1 flex items-center justify-center border border-gray-100">
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
                    <h4 className="font-bold text-gray-900 text-xs truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {product.subtitle}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      Qty: {quantity}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-gray-900 text-xs block">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ₹{product.price.toLocaleString('en-IN')} ea
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-4" />

            {/* Bill Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-gray-900">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-[#198038]">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Handling & Packaging</span>
                <span className="font-bold text-gray-900">
                  ₹{order.handlingFee}
                </span>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-lg font-bold text-gray-900 block">Total Paid</span>
                <span className="text-xs text-gray-500">{order.paymentMethod}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#198038] block">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-gray-400">Inclusive of all taxes</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/account?tab=orders')}
              className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-bold rounded-xl py-3.5 transition-colors text-sm flex items-center justify-center gap-2 mb-3 shadow-xs cursor-pointer"
            >
              Track in My Account <ChevronRight size={18} />
            </button>
            <Link
              to="/"
              className="block w-full text-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold rounded-xl py-3 transition-colors text-sm mb-4"
            >
              Continue Shopping
            </Link>

            <button
              onClick={() => navigate('/help')}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-xs py-1 transition-colors cursor-pointer"
            >
              <Headset size={16} /> Need help with this order? <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, MapPin, Map as MapIcon, Info, ChevronRight, Headset } from 'lucide-react';

export default function OrderConfirmed() {
  const navigate = useNavigate();

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
        
        {/* Left Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Success Banner */}
          <div className="bg-[#eef8f1] rounded-2xl p-8 flex items-start gap-6 border border-[#c4ebd3]">
            <div className="bg-[#198038] text-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-2">Order placed successfully!</h1>
              <p className="text-xl text-gray-700 mb-4">Thanks, Tarak. We're getting your items ready.</p>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Order #NM-240918-5821</span>
                <span className="inline-flex items-center gap-1.5 bg-[#c4ebd3] text-[#125A27] px-3 py-1 rounded-full text-sm font-semibold">
                  <CheckCircle size={16} /> Payment confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Tracker */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4 items-center">
                <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038]">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Arriving today</h3>
                  <p className="text-gray-500 mt-1">10-20 mins</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-center border-l border-gray-200 pl-6">
                <MapPin size={24} className="text-gray-400" />
                <div>
                  <p className="font-bold text-gray-900 text-sm"><span className="mr-1">Home</span> <span className="text-gray-300 mx-1">·</span> <span className="text-gray-500 font-normal">Indiranagar, Bengaluru</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Tarak S. <span className="text-gray-300 mx-1">|</span> +91 98•• •••42</p>
                </div>
                <button onClick={() => navigate('/account')} className="ml-4 bg-[#eef8f1] hover:bg-[#c4ebd3] text-[#125A27] font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  Track order
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative mb-10 px-4">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0">
                <div className="w-[33%] h-full bg-[#198038]"></div>
              </div>
              <div className="relative z-10 flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Order placed</span>
                  <span className="text-xs text-gray-400 mt-0.5">10:24 AM</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    2
                  </div>
                  <span className="text-sm font-bold text-gray-900">Packing</span>
                  <span className="text-xs text-gray-400 mt-0.5">Preparing your items</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-600">On the way</span>
                  <span className="text-xs text-gray-400 mt-0.5">Out for delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm mb-2 shadow-[0_0_0_4px_white]">
                    4
                  </div>
                  <span className="text-sm font-medium text-gray-600">Delivered</span>
                  <span className="text-xs text-gray-400 mt-0.5">Enjoy your order</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#f2f4f1] rounded-xl h-48 relative overflow-hidden flex items-center justify-center border border-gray-200">
              <div className="absolute inset-0 flex" style={{
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 150 120 Q 300 120 350 140 T 600 130" fill="none" stroke="#198038" strokeWidth="4" />
                <path d="M 600 130 Q 700 120 750 160" fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="8 8" />
              </svg>

              <div className="absolute left-[15%] top-[40%] flex flex-col items-center bg-white/80 backdrop-blur-sm p-2 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md mb-1 border border-gray-100 text-[#198038]">
                  <MapIcon size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900">NOVA MART</span>
                <span className="text-[10px] text-gray-500">Preparing your order</span>
              </div>

              <div className="absolute left-[45%] top-[60%] flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#198038] text-[#198038] z-10">
                  <Truck size={24} />
                </div>
              </div>

              <div className="absolute right-[15%] top-[50%] flex flex-col items-center bg-white/80 backdrop-blur-sm p-2 rounded-lg">
                <div className="w-10 h-10 bg-[#eef8f1] rounded-full flex items-center justify-center shadow-md mb-1 border border-[#c4ebd3] text-[#198038]">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900">Your location</span>
                <span className="text-[10px] text-gray-500">Indiranagar, Bengaluru</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl">
              <Info size={20} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Your delivery partner will be assigned shortly</p>
                <p className="text-sm">We'll notify you as soon as a partner is on the way.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order summary</h2>
              <span className="text-sm text-gray-500 font-medium">3 items</span>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-1 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Headphones" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 flex justify-between items-start pt-1">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Wireless headphones</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Sony WH-CH720N</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm block">₹ 4,999</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Qty: 1</span>
                  </div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-1 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Air fryer" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 flex justify-between items-start pt-1">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Air fryer</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Havells Pro Cook 4.2 L</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm block">₹ 3,999</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Qty: 1</span>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-1 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 flex justify-between items-start pt-1">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Strawberries</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Fresh, 250 g</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm block">₹ 99</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Qty: 1</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Item subtotal (3 items)</span>
                <span className="font-bold text-gray-900">₹ 9,097</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span className="font-bold text-[#198038]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (WELCOME500)</span>
                <span className="font-bold text-[#198038]">- ₹ 500</span>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="flex justify-between items-start mb-8">
              <span className="text-2xl font-bold text-gray-900">Total paid</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 block">₹ 8,597</span>
                <span className="text-sm text-gray-500 mt-1 block">Paid by UPI</span>
              </div>
            </div>

            <button onClick={() => navigate('/account')} className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-semibold rounded-lg py-3.5 transition-colors text-lg flex items-center justify-center gap-2 mb-3">
              Track order <ChevronRight size={20} />
            </button>
            <Link to="/" className="block w-full text-center bg-white border border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-semibold rounded-lg py-3.5 transition-colors text-lg mb-6">
              Continue shopping
            </Link>

            <button onClick={() => navigate('/help')} className="w-full flex items-center justify-center gap-2 text-gray-700 font-medium hover:text-black">
              <Headset size={20} /> Need help? <ChevronRight size={16} className="text-gray-400" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

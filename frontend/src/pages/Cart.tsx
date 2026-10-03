import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Info, ShieldCheck, RotateCcw, Truck, Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';

export default function Cart() {
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
              <span className="text-gray-900 font-medium">Your cart</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your cart</h1>
        <p className="text-lg text-gray-600 mt-1">3 items ready for delivery</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          {/* Item 1 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-2 overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                alt="Wireless headphones" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Wireless headphones</h3>
              <p className="text-sm text-gray-500 mt-1">Sony WH-CH720N</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                <span className="text-[#198038]">⚡</span> 10-20 mins
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
              <span className="text-xl font-bold text-gray-900">₹ 4,999</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">1</span>
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-2 overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                alt="Air fryer" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Air fryer</h3>
              <p className="text-sm text-gray-500 mt-1">Havells Pro Cook 4.2 L</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                <span className="text-[#198038]">⚡</span> 10-20 mins
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
              <span className="text-xl font-bold text-gray-900">₹ 3,999</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">1</span>
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-2 overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                alt="Strawberries" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Strawberries</h3>
              <p className="text-sm text-gray-500 mt-1">Fresh, 250 g</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                <span className="text-[#198038]">⚡</span> 10-20 mins
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
              <span className="text-xl font-bold text-gray-900">₹ 99</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">1</span>
                  <button className="px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-4">
            <Link to="/" className="inline-flex items-center text-[#198038] font-bold hover:underline">
              <ChevronLeft size={20} className="mr-1" /> Continue shopping
            </Link>
          </div>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Delivery Address Box */}
          <div className="bg-[#f8f6f2] rounded-2xl p-5 border border-[#e8e4db] flex justify-between items-start">
            <div className="flex gap-3">
              <div className="mt-1 bg-[#eef8f1] text-[#198038] rounded-full p-1">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivering to</p>
                <p className="font-bold text-gray-900">Indiranagar, Bengaluru</p>
                <p className="text-sm text-gray-500 mt-1">10-20 mins delivery • Home</p>
              </div>
            </div>
            <button className="text-[#198038] font-medium text-sm hover:underline">Change</button>
          </div>

          {/* Summary Box */}
          <div className="bg-[#f8f6f2] rounded-2xl p-6 border border-[#e8e4db]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Order summary</h2>
            
            <div className="space-y-4 text-gray-700 font-medium mb-6">
              <div className="flex justify-between">
                <span>Item subtotal (3 items)</span>
                <span className="font-bold text-gray-900">₹ 9,097</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery fee <Info size={14} className="text-gray-400 cursor-pointer" />
                </span>
                <span className="font-bold text-[#198038]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-bold text-[#198038]">- ₹ 500</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mb-6 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹ 8,597</span>
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Enter promo code" 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#198038]"
              />
              <button className="bg-white border-2 border-[#198038] text-[#198038] font-semibold rounded-lg px-6 hover:bg-[#eef8f1] transition-colors">
                Apply
              </button>
            </div>

            <button 
              className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-semibold rounded-lg py-4 transition-colors text-lg flex items-center justify-center gap-2 mb-6"
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout <ChevronRight size={20} className="ml-1" />
            </button>

            {/* Guarantees */}
            <div className="flex justify-between gap-2">
              <div className="flex flex-col items-center gap-1 text-center w-1/3">
                <ShieldCheck className="text-[#198038]" size={20} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Secure<br/>checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center w-1/3">
                <RotateCcw className="text-[#198038]" size={20} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Easy<br/>returns</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center w-1/3">
                <Truck className="text-[#198038]" size={20} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Fast<br/>delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Adding ChevronRight manually as it was used but not imported
function ChevronRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

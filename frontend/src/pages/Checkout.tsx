import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Truck, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet, 
  Plus, 
  Lock, 
  ChevronDown, 
  Check, 
  X 
} from 'lucide-react';

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('upi');

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
              <Link to="/cart" className="hover:text-gray-900">Your cart</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm">
              <Check size={16} />
            </div>
            <span className="text-xs font-medium text-gray-600 mt-1">Cart</span>
          </div>
          <div className="w-16 h-0.5 bg-[#198038] mb-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-xs font-bold text-[#198038] mt-1">Delivery</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200 mb-4"></div>
          <div className="flex flex-col items-center opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span className="text-xs font-medium text-gray-500 mt-1">Payment</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Form Areas */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          
          {/* Delivery Address */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Delivery address</h2>
            <p className="text-sm text-gray-500 mb-4">Select a delivery address</p>
            
            <div className="border-2 border-[#198038] rounded-xl p-4 flex justify-between items-start bg-white shadow-sm mb-3">
              <div className="flex gap-4">
                <div className="pt-1">
                  <div className="w-5 h-5 rounded-full border-[6px] border-[#198038] bg-white"></div>
                </div>
                <div className="bg-[#eef8f1] p-2 rounded-full h-10 w-10 flex items-center justify-center text-[#198038] mt-1">
                  <HomeIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Home</h3>
                  <p className="text-sm text-gray-600 mt-1">Indiranagar, Bengaluru 560038</p>
                  <p className="text-sm text-gray-500 mt-1">Tarak S. <span className="mx-2 text-gray-300">|</span> +91 98•• •••42</p>
                </div>
              </div>
              <button className="text-[#198038] font-semibold text-sm hover:underline">Edit</button>
            </div>

            <button className="w-full border border-gray-300 rounded-xl py-4 flex justify-center items-center gap-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              <Plus size={18} /> Add new address
            </button>
          </div>

          {/* Delivery Time */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose delivery time</h2>
            <p className="text-sm text-gray-500 mb-4">Get your order at a time that works for you</p>
            
            <div className="flex gap-4">
              <div className="flex-1 border-2 border-[#198038] rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm cursor-pointer">
                <div className="w-5 h-5 rounded-full border-[6px] border-[#198038] bg-white flex-shrink-0"></div>
                <div className="bg-[#eef8f1] p-2 rounded-full text-[#198038]">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Fast delivery</h3>
                  <p className="text-sm text-gray-500">Today, 10-20 mins</p>
                </div>
              </div>
              
              <div className="flex-1 border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-white hover:border-gray-300 transition-colors cursor-pointer opacity-75">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex-shrink-0"></div>
                <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Schedule delivery</h3>
                  <p className="text-sm text-gray-500">Choose a time slot</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment method</h2>
            <p className="text-sm text-gray-500 mb-4">Choose a secure payment option</p>
            
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100">
              
              {/* UPI */}
              <div className="p-4 flex justify-between items-center bg-gray-50/50 cursor-pointer" onClick={() => setPaymentMethod('upi')}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${paymentMethod === 'upi' ? 'border-[6px] border-[#198038] bg-white' : 'border-2 border-gray-300 bg-white'}`}></div>
                  <div className="text-gray-600">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">UPI</h3>
                    <p className="text-sm text-gray-500">Pay with any UPI app</p>
                  </div>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="w-64 hidden sm:block">
                    <input 
                      type="text" 
                      placeholder="Enter UPI ID (e.g. name@upi)" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#198038]"
                    />
                  </div>
                )}
              </div>

              {/* Credit / debit card */}
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setPaymentMethod('card')}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${paymentMethod === 'card' ? 'border-[6px] border-[#198038] bg-white' : 'border-2 border-gray-300 bg-white'}`}></div>
                  <div className="text-gray-600">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Credit / debit card</h3>
                    <p className="text-sm text-gray-500">Visa, Mastercard, Rupay and more</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* Cash on delivery */}
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setPaymentMethod('cod')}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${paymentMethod === 'cod' ? 'border-[6px] border-[#198038] bg-white' : 'border-2 border-gray-300 bg-white'}`}></div>
                  <div className="text-gray-600">
                    <Banknote size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Cash on delivery</h3>
                    <p className="text-sm text-gray-500">Pay at the time of delivery</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* Wallet */}
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setPaymentMethod('wallet')}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 ${paymentMethod === 'wallet' ? 'border-[6px] border-[#198038] bg-white' : 'border-2 border-gray-300 bg-white'}`}></div>
                  <div className="text-gray-600">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Wallet</h3>
                    <p className="text-sm text-gray-500">Use your wallet balance</p>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar: Summary List */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#f8f6f2] rounded-2xl p-6 border border-[#e8e4db] sticky top-4">
            
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order summary</h2>
              <span className="text-sm text-gray-500 font-medium">3 items</span>
            </div>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {/* Item 1 */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1 flex items-center justify-center border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Headphones" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">Wireless headphones</h4>
                    <span className="font-bold text-gray-900 ml-2 whitespace-nowrap">₹ 4,999</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-gray-500 truncate">Sony WH-CH720N</p>
                    <span className="text-xs text-gray-500">Qty: 1</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[10px] font-semibold px-1.5 py-0.5 rounded w-max">
                    <span className="text-[#198038]">⚡</span> 10-20 mins
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1 flex items-center justify-center border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Air fryer" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">Air fryer</h4>
                    <span className="font-bold text-gray-900 ml-2 whitespace-nowrap">₹ 3,999</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-gray-500 truncate">Havells Pro Cook 4.2 L</p>
                    <span className="text-xs text-gray-500">Qty: 1</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[10px] font-semibold px-1.5 py-0.5 rounded w-max">
                    <span className="text-[#198038]">⚡</span> 10-20 mins
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1 flex items-center justify-center border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">Strawberries</h4>
                    <span className="font-bold text-gray-900 ml-2 whitespace-nowrap">₹ 99</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-gray-500 truncate">Fresh, 250 g</p>
                    <span className="text-xs text-gray-500">Qty: 1</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[10px] font-semibold px-1.5 py-0.5 rounded w-max">
                    <span className="text-[#198038]">⚡</span> 10-20 mins
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="space-y-3 text-sm text-gray-700 font-medium mb-4">
              <div className="flex justify-between">
                <span>Subtotal (3 items)</span>
                <span className="font-bold text-gray-900">₹ 9,097</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">Delivery</span>
                <span className="font-bold text-[#198038]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-bold text-[#198038]">- ₹ 500</span>
              </div>
            </div>

            <div className="bg-[#eef8f1] border border-[#c4ebd3] rounded-lg p-2 flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[#198038] font-semibold text-xs">
                <span className="rotate-45 block">🏷️</span> WELCOME500 applied
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#198038] text-sm">- ₹ 500</span>
                <button className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mb-6 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total to pay</span>
              <span className="text-2xl font-bold text-gray-900">₹ 8,597</span>
            </div>

            <Link to="/order-confirmed" className="w-full bg-[#198038] hover:bg-[#125A27] text-white font-semibold rounded-lg py-4 transition-colors text-lg flex items-center justify-center gap-2 mb-4 shadow-sm shadow-[#198038]/20">
              Place order
            </Link>

            <div className="flex items-start gap-2 text-xs text-gray-500 justify-center text-center mt-4">
              <Lock size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-700">Secure payment</p>
                <p>Your information is safe and encrypted.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
